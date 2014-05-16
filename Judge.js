var Judge = function() {
    this.placeablep = function(sourcePlayer, targetPlayer, y, x, card,participantsCountor) {
	var cardTryingToPut = [card.topIsConnected,
 			       card.rightIsConnected,
			       card.bottomIsConnected,
			       card.leftIsConnected];
	var cardMaterialTryingToPut = [card.topMaterial,
				       card.rightMaterial,
				       card.bottomMaterial,
				       card.leftMaterial];
	var surround = (function(field,sy,sx,card){
	    var tmpSurround = [];
            var vx = [0,1,0,-1];
	    var vy = [-1,0,1,0];
	    for(var i=0;i<4;i++){
		var x = sx + vx[i];
		var y = sy + vy[i];
		if(typeof field.map[y][x] == "undefined"){
		    tmpSurround[i] = "undef";
		}
		else{
                    var putCard = field.getCard(y,x);
		    switch(i){
		    case 0:tmpSurround[i] = putCard.bottomIsConnected;break;
		    case 1:tmpSurround[i] = putCard.leftIsConnected;break;
		    case 2:tmpSurround[i] = putCard.topIsConnected;break;
		    case 3:tmpSurround[i] = putCard.rightIsConnected;break;
		    }
		}
	    }
            return tmpSurround;
	})(targetPlayer.field,y,x,card);

	var cloneObject = function(obj){
            var clone = {};
            for(var i in obj){
		if(typeof obj[i] == "object") clone[i] = cloneObject(obj[i]);
		else clone[i] = obj[i];
	    }
	    return clone;
	};
	
	var rulep = function(sourcePlayer,targetPlayer,y,x,card){
            var checkCardTryingToPutIsNotLeak = function(field,y,x,card){
 		for(var i=0;i<4;i++){
                    if(cardTryingToPut[i] === true && surround[i] === true){
                        if(cardMaterialTryingToPut[i] == "Leaked") return false;
		    }
		}
		return true;
	    };

            var checkCardTryingToPutIsLeak = function(field,y,x,card){
 		for(var i=0;i<4;i++){
                    if(cardTryingToPut[i] === true && surround[i] === true){
                        if(cardMaterialTryingToPut[i] != "Leaked") return false;
		    }
		}
		return true;
	    };

	    var checkPutCardIsPb = function(field,y,x,card){
		var alreadyPutCard = field.getCard(y,x);
 		for(var i=0;i<4;i++){
                    if(cardTryingToPut[i] === true && surround[i] === true){
			switch(i){
			case 0:if(alreadyPutCard.topMaterial != "Pb") return false; break;
			case 1:if(alreadyPutCard.rightMaterial != "Pb") return false; break;                        
			case 2:if(alreadyPutCard.bottomMaterial != "Pb") return false; break;
			case 3:if(alreadyPutCard.leftMaterial != "Pb") return false; break;
			}
		    }
		}
		return true;
	    };
            
 	    if(sourcePlayer.id == targetPlayer.id){ //自分のところに置く場合
		console.log("自分のところに置く場合");
                if(checkCardTryingToPutIsNotLeak(targetPlayer.field,y,x,card)){ //置こうとするカードが水漏れではないか
		    console.log("置こうとするカードが水漏じゃなかった");
		    if(targetPlayer.isLeaked && !targetPlayer.field.emptyp(y,x)){ //自分の状態が水漏れ且つ置こうとする座標にカードが置かれている
			console.log("自分の状態が水漏れかつ置こうとする座標にカードが置かれてた");
                        var putCard = targetPlayer.field.getCard(y,x);
 			if(putCard.shape == card.shape && targetPlayer.field.getLeakState(y,x)){ //置いてあるカードが水漏れ且つ置いてあるカードと置こうとするカードが同じ形か
			    console.log("置いてあるカードが水漏れ且つ置いてあるカードと置こうとするカードが同じ形だった");
                            targetPlayer.isLeaked = false;
			    return true;
			}
		    }
		    else if(!targetPlayer.isLeaked && targetPlayer.field.emptyp(y,x)){ //自分の状態が水漏れではない且つ置こうとする座標にカードが置かれてない
			console.log("自分の状態が水漏れではない且つ置こうとする座標にカードが置かれてない");
                        return true;
		    }
		}
	    }
	    else{ //相手のところに置く場合
		console.log("相手のところに置く場合");
                if(!targetPlayer.isLeaked && checkCardTryingToPutIsLeak(targetPlayer.field.y,x,card)){ //相手の状態が水漏れではない且つ置こうとするカードは水漏れ
                    console.log("相手の状態が水漏れではない且つ置こうとするカードは水漏れ");
                    if(!targetPlayer.field.emptyp(y,x)){ //置こうとする座標にカードがある場合
			console.log("置こうとする座標にカードがある場合");
			var putCard = targetPlayer.field.getCard(y,x);
			console.log(targetPlayer.field.getCard(y,x));
			if(putCard.shape == card.shape && checkPutCardIsPb(targetPlayer.field,y,x,card)){ //置いてあるカードと置こうとするカードが同じ形且つ置いてあるカードがPb
			    console.log("置いてあるカードと置こうとするカードが同じ形且つ置いてあるカードがPb");
			    targetPlayer.isLeaked = true;
                            return true;
			}
		    }
		    else{ //置こうとする座標にカードが無い場合
			console.log("置こうとする座標にカードが無い場合");
			targetPlayer.isLeaked = true;
			return true;
		    }
		}
	    }
	    return false;
        };

        var connectp = function(field, y, x, card){
 	    if(card.shape == "Deadend"){
		for(var i=0;i<4;i++){
 		    if(cardTryingToPut[i] && surround[i]){
			return true;
		    }
		}
	    }
	    else{
                for(var i=0;i<4;i++){
                    if(cardTryingToPut[i] === true && surround[i] === true){
                        for(var j=0;j<4;j++){
			    if(cardTryingToPut[j] && surround[j] == "undef"){
				return true;
			    }
			}
		    }
		}
	    }
	    return false;
	};

        var closep = function(targetPlayer, y, x, card){
            var field = cloneObject(targetPlayer.field);
            field.putOrdinaryCard(card,y,x);
	    
	    var putCardTotal; 
	    if(targetPlayer.field.emptyp(y,x)) putCardTotal = targetPlayer.putCardCountor+1;
	    else putCardTotal = targetPlayer.putCardCountor;
	    var putCardCountor = 0;
            
	    var detectUndefinedFlag = false;
	    var searchedMap = [];

 	    var dfs = function(y,x){
                
                if(field.emptyp(y,x) === true){
                    detectUndefinedFlag = true;
		}
		else if(field.getCard(y,x).shape == "Deadend"){
		    putCardCountor++;
		}
		else{
		    var card = field.getCard(y,x);
		    searchedMap[y+":"+x] = true;
                    putCardCountor++;

 		    if(card.topIsConnected    === true && (typeof searchedMap[(y-1)+":"+ x   ]) == "undefined"){console.log("top");    dfs(y-1,x);} 
		    if(card.rightIsConnected  === true && (typeof searchedMap[ y   +":"+(x+1)]) == "undefined"){console.log("right");  dfs(y,x+1);}
		    if(card.bottomIsConnected === true && (typeof searchedMap[(y+1)+":"+ x   ]) == "undefined"){console.log("bottom"); dfs(y+1,x);}
		    if(card.leftIsConnected   === true && (typeof searchedMap[ y   +":"+(x-1)]) == "undefined"){console.log("left");   dfs(y,x-1);} 
		}
	    };
            dfs(50,50);	    
            
	    if(putCardCountor == putCardTotal && detectUndefinedFlag === true) return true;
	    return false;
	};
        
	var connectpForEnd = function(){
	    for(var i=0;i<4;i++){
		if(surround[i] === true && cardTryingToPut[i] === true){
		    return true;
		}
	    }
	    return false;
	};

        var closepForEnd = function(targetPlayer, y, x, card){
            var field = cloneObject(targetPlayer.field);
            field.putOrdinaryCard(card,y,x);
	    
	    var putCardTotal; 
	    if(targetPlayer.field.emptyp(y,x)) putCardTotal = targetPlayer.putCardCountor+1;
	    else putCardTotal = targetPlayer.putCardCountor;
	    var putCardCountor = 0;
            
	    var detectUndefinedFlag = false;
	    var searchedMap = [];

 	    var dfs = function(y,x){
                
                if(field.emptyp(y,x) === true){
                    detectUndefinedFlag = true;
		}
		else if(field.getCard(y,x).shape == "Deadend"){
		    putCardCountor++;
		}
		else{
		    var card = field.getCard(y,x);
		    searchedMap[y+":"+x] = true;
                    putCardCountor++;

 		    if(card.topIsConnected    === true && (typeof searchedMap[(y-1)+":"+ x   ]) == "undefined"){console.log("top");    dfs(y-1,x);} 
		    if(card.rightIsConnected  === true && (typeof searchedMap[ y   +":"+(x+1)]) == "undefined"){console.log("right");  dfs(y,x+1);}
		    if(card.bottomIsConnected === true && (typeof searchedMap[(y+1)+":"+ x   ]) == "undefined"){console.log("bottom"); dfs(y+1,x);}
		    if(card.leftIsConnected   === true && (typeof searchedMap[ y   +":"+(x-1)]) == "undefined"){console.log("left");   dfs(y,x-1);} 
		}
	    };
            dfs(50,50);	    
            
	    if(putCardCountor == putCardTotal && detectUndefinedFlag === false) return true;
	    return false;
	};

	if(card.name == "EndPipe" && connectpForEnd() && closepForEnd(targetPlayer,y,x,card)){
	    var winningp = function(){
	    };

	    var tmpField = cloneObject(targetPlayer.field);
            tmpField.putOrdinaryCard(card,y,x);
	    var State = function(y,x,distance){
		this.y = y;
		this.x = x;
		this.distance = distance;
	    };
            var firstState = new State(50,50,0);
            var searchedMap = [];
	    searchedMap[firstState.y+":"+firstState.x] = true;
	    var q = [];
            q.push(firstState);
	    var maxDistance = 0;
            while(q.length !== 0){
		var centerCard = tmpField.getCard(q[0].y,q[0].x);
		centerCard = [centerCard.topIsConnected,centerCard.rightIsConnected,centerCard.bottomIsConnected,centerCard.leftIsConnected];
		var vx = [0 , 1, 0, -1];
		var vy = [-1, 0, 1, 0 ];
		for(var i=0;i<4;i++){
                    var gy = q[0].y + vy[i];
		    var gx = q[0].x + vx[i];
		    if(tmpField.emptyp(gy,gx) === false){
			var surroundCard = tmpField.getCard(gy,gx);
			switch(i){
			case 0:surroundCard = surroundCard.bottomIsConnected;break;
			case 1:surroundCard = surroundCard.leftIsConnected;break;
			case 2:surroundCard = surroundCard.topIsConnected;break;
			case 3:surroundCard = surroundCard.rightIsConnected;break;
			}
			if(typeof searchedMap[gy+":"+gx] == "undefined" && centerCard[i] === true && surroundCard === true) q.push(new State(gy,gx,q[0].distance+1));
			searchedMap[gy+":"+gx] = true;
		    }
		}
		maxDistance = Math.max(maxDistance,q[0].distance);
		console.log(q);
		q.shift();
	    }
	    
	    console.log(maxDistance);
	    switch(participantsCountor){
	    case 1:{if(maxDistance>10){return true;} break;}
	    case 2:{if(maxDistance>15){return true;} break;}
	    case 3:{if(maxDistance>12){return true;} break;}
	    case 4:{if(maxDistance>10){return true;} break;}
	    case 5:{if(maxDistance>8){return true;} break;}
	    }
            return false;
	}
        else if(rulep(sourcePlayer,targetPlayer,y,x,card) && connectp(targetPlayer.field,y,x,card) && closep(targetPlayer, y, x, card)) return true;
	return false;
    };
    
    this.putCard = function(sourcePlayer, targetPlayer, y, x, card){
        if(sourcePlayer.id != targetPlayer.id){
            targetPlayer.field.putLeakedCard(card,y,x);
	}
	else{
	    if(targetPlayer.field.emptyp(y,x)){
                targetPlayer.field.putOrdinaryCard(card,y,x);
	    }
	    else{
		targetPlayer.field.putRepairCard(card,y,x);
	    }
	}
    };
    
    this.wrenchUsablep = function(field,y,x) {
	if(field.emptyp(y,x)){
	    return false;
	}
        if(field.getLeakState(y,x) === true) return true;
	else return false;
    };

    this.winningp = function() {
	return true;
    };
};

module.exports = Judge;
