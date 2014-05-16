var Card = require("./Card");
var Deck = require("./Deck");
var Field = require("./Field");
var Judge = require("./Judge");

var Player = function(name,id){
    this.name = name;
    this.id = id;
    this.wrench = 2;
    this.hand = [new Card('EndPipe', 'End', 'End',false, true, false, false, null, 'Pb', null, null)];
    this.field = new Field();
    this.isLeaked = false;
    this.putCardCountor = 1;
    this.ready = false;

    this.draw = function(card){
	this.hand.push(card);
    };
    this.useWrench = function(x, y){
	if(this.wrench>0 && judge.usablep(this.field, x, y)){
	    this.wrench--;
	}
    };
    this.putCard = function(index, x, y){
	if(judge.placeblep(this.hand[index], this.field, x, y)){
            this.hand.splice(index, 1);
	    this.draw();
	}
    };
    this.throwCard = function(index){
	this.hand.splice(index, 1);
    };
};

module.exports = Player;
