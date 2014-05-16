var Box = require('./Box');
var Card = require('./Card');

var Field = function() {
    this.map = (function(){
	tmpMap = [];
	for(var i=0;i<=100;++i){
	    tmpMap[i] = [];
	}
	var StartPipeCard = new Card('StartPipe', 'Start', 'Start', false, false, false , true, null, null, null, 'Pb');
	tmpMap[50][50] = new Box(StartPipeCard, false, false);
	
	return tmpMap;
    })();
    this.maxX = 51;
    this.minX = 49;
    this.maxY = 51;
    this.minY  =49;
    
    this.emptyp = function(y,x){
        if(typeof this.map[y][x] == "undefined") return true;
	else return false;
    };
    this.getCard = function(y,x){
 	if(this.emptyp(y,x)) return undefined;
	return this.map[y][x].card;
    };
    this.getRepairState = function(y,x){
	return this.map[y][x].isRepaired;
    };
    this.getLeakState = function(y,x){
	return this.map[y][x].isLeaked;
    };
    this.putOrdinaryCard = function(Card,y,x){
        this.map[y][x] = new Box(Card, false, false);
    };
    this.putLeakedCard = function(Card,y,x){
	this.map[y][x] = new Box(Card, true, false);
    };
    this.putRepairCard = function(Card,y,x){
	this.map[y][x] = new Box(Card, true, true);
    };
    this.useWrench = function(y,x){
	this.map[y][x].isRepaired = true;
	this.map[y][x].isRepairedByWrench = true;
    };
    
};

module.exports = Field;
