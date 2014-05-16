var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var path = require("path");
var mimeTypes = {
    '.js': 'text/javascript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
};

var server = http.createServer(function(request, response){
    var lookup = path.basename(decodeURI(request.url)) || 'index.html',
	f = lookup;
    fs.exists(f,function(exists){
	if(exists) {
	    fs.readFile(f, function(err, data){
		if(err){
		    response.writeHead(500);
		    response.end('Server Error!');
		    return;
		}
		var headers = {'Content-type': mimeTypes[path.extname(f)]};
		response.writeHead(200,headers);
		response.end(data);
	    });
	    return;
	}
	response.writeHead(404);
	response.end('page not found.');
    });
}).listen(process.env.VMC_APP_PORT || 3000);
var io = socketio.listen(server);

var Judge = require("./Judge");
var Deck = require("./Deck");
var Player = require("./Player");
var judge = new Judge();
var deck = new Deck();
var playerCounter = 0;
var players = (function(){
    var tmpPlayers = [];
    for(var i=0;i<5;i++){
	tmpPlayers[i] = new Player("player"+i,i);
    }
    return tmpPlayers;
})();

var turn = 0;
var participantsCountor = 0;
var gameIsStart = false;

var addressDictionary = {};
var printLog = function(message){
    io.sockets.emit("printLog",{status:"success", value:message});
};
var debug = function(value){
    io.sockets.emit("debug",{status:"success", value:value});
};
var progressTurn = function(){
    turn++;
    if(turn == participantsCountor) turn = 0;
};
var initGame = function(){
    judge = new Judge();
    deck = new Deck();
    playerCounter = 0;
    players = (function(){
	var tmpPlayers = [];
	for(var i=0;i<5;i++){
	    tmpPlayers[i] = new Player("player"+i,i);
	}
	return tmpPlayers;
    })();
    turn = 0;
    participantsCountor = 0;
    gameIsStart = false;
    addressDictionary = {};
    io.sockets.emit("update", {status:"success", value:players});
};

io.sockets.on("connection", function(socket){
    socket.on("registerNewPlayer", function(){
	if(!gameIsStart){
            participantsCountor++;
	    if(playerCounter<5){
 		var newPlayer = players[playerCounter];
                var address = socket.handshake.address.address+socket.handshake.address.port+"";
 		addressDictionary[address] = players[playerCounter];
		for(var i=0;i<5;i++){newPlayer.draw(deck.pop());}
		io.sockets.emit("registerNewPlayer", {status:"success", value:playerCounter});
		printLog(players[playerCounter].name + "がゲームに参加しました。");
 		playerCounter++;
	    }
	    else{
		printLog("観賞用モード");
	    }
	}
    });
    
    socket.on("update", function(){
        io.sockets.emit("update", {status:"success", value:players});
    });

    socket.on("discardCard", function(data){
	var sourcePlayer = addressDictionary[socket.handshake.address.address+socket.handshake.address.port+""];
        if(gameIsStart && turn == sourcePlayer.id){
	    printLog(sourcePlayer.name+"がカード（"+sourcePlayer.hand[data.value].name+"）を捨てました。");
	    sourcePlayer.hand.splice(data.value,1);
	    sourcePlayer.draw(deck.pop());
            progressTurn();
            io.sockets.emit("update", {status:"success", value:players});
	}
    });

    socket.on("rotateCard", function(data){
        var sourcePlayer = addressDictionary[socket.handshake.address.address+socket.handshake.address.port+""];
        sourcePlayer.hand[data.value].rotate();
        io.sockets.emit("update", {status:"success", value:players});
    });

    socket.on("toggleReady", function(){
	if(gameIsStart == false){
            var sourcePlayer = addressDictionary[socket.handshake.address.address+socket.handshake.address.port+""];
	    if(sourcePlayer.ready) sourcePlayer.ready = false;
	    else sourcePlayer.ready = true;
	    var flag = true;
            for(var i=0;i<participantsCountor;i++){
		if(!players[i].ready) flag = false;
	    }
	    if(flag){
		gameIsStart = true;
		printLog("ゲームを開始します。");
	    }
	    io.sockets.emit("update", {status:"success", value:players});
	}
    });
    
    socket.on("askJudge", function(data){
	var address = socket.handshake.address.address+socket.handshake.address.port+"";
	var sourcePlayer = addressDictionary[address];
	if(gameIsStart && turn == sourcePlayer.id){
	    var targetPlayer = players[data.value.targetPlayerId];
	    if(targetPlayer.id >= participantsCountor) return false;

	    var y = data.value.y;
	    var x = data.value.x;
	    var card = sourcePlayer.hand[data.value.clickedHandIndex];
	    if(data.value.clickedHandIndex<6){
		if(judge.placeablep(sourcePlayer, targetPlayer, y, x, card,participantsCountor)){
		    if(targetPlayer.field.emptyp(y,x)) targetPlayer.putCardCountor++;
		    console.log("judgeに許可されました");
		    judge.putCard(sourcePlayer, targetPlayer, y ,x, card);
		    sourcePlayer.hand.splice(data.value.clickedHandIndex,1);
		    sourcePlayer.draw(deck.pop());
		    
		    if(targetPlayer.field.maxX == x) targetPlayer.field.maxX++;
		    if(targetPlayer.field.minX == x) targetPlayer.field.minX--;
		    if(targetPlayer.field.maxY == y) targetPlayer.field.maxY++;
		    if(targetPlayer.field.minY == y) targetPlayer.field.minY--;
                    
		    printLog(sourcePlayer.name +
			     "が" +
			     targetPlayer.name +
			     "のフィールド（" +
			     (y - targetPlayer.field.minY) +
			     "," +
			     (x - targetPlayer.field.minX) +
			     "）にカード（" +
			     card.name +
			     "）を置きました。");

		    io.sockets.emit("judgementResult", {status:"success", value:{result:true, type:"card", details:card}});
		    if(card.name == "EndPipe"){
			gameIsStart = false;
			io.sockets.emit("gameEnd",{status:"success", value:{message:sourcePlayer.name + "が上がりました。ゲームが終了します。"}});
		    }
		    progressTurn();
                    io.sockets.emit("update", {status:"success", value:players});		    
		}
		else{
                    io.sockets.emit("judgementResult", {status:"success", value:{result:false, message:targetPlayer.name+"のフィールド（"+(y-targetPlayer.field.minY)+","+(x-targetPlayer.field.minX)+"）"+"には選択されたカード（"+card.name+"）は置けません。"}});
                    
		}
	    }
	    else{ //レンチのとき
		if(judge.wrenchUsablep(targetPlayer.field,y,x)){
		    if(targetPlayer.id == sourcePlayer.id){
			targetPlayer.field.map[y][x].isRepairedByWrench = true;
			targetPlayer.field.map[y][x].isRepaired = true;
			targetPlayer.field.map[y][x].isLeaked = false;
			sourcePlayer.wrench--;
			sourcePlayer.isLeaked = false;
			progressTurn();
			io.sockets.emit("judgementResult", {status:"success", value:{result:true, type:"wrench"}});
			io.sockets.emit("update", {status:"success", value:players});
		    }
		}
		else{
		    io.sockets.emit("judgementResult", {status:"success", value:{result:false, message:targetPlayer.name+"のフィールド（"+(y-targetPlayer.field.minY)+","+(x-targetPlayer.field.minX)+"）"+"ではレンチは使えません。"}});
		}
	    }
	}
    });
    socket.on("disconnect", function(){
	var address = socket.handshake.address.address+socket.handshake.address.port+"";
	var sourcePlayer = addressDictionary[address];
	if(gameIsStart == true){
            io.sockets.emit("gameEnd", {status:"success", value:{message:sourcePlayer.name+"がゲームを離れました。ゲームを終了します。"}});
	    initGame();
	}
	else{
	    io.sockets.emit("gameEnd", {status:"success", value:{message:"ゲームを終了します。"}});
	    initGame();
	}
    });
});
