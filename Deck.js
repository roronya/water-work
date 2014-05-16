Card = require("./Card");

var Deck = function() {
    this.cards = [];
    var init = function(cards) {
	var VerticalPbCount = 11;
	var VerticalCuCount = 5;
	var VerticalLeakedCount = 5;
	var HorizontalPbCount = 11;
	var HorizontalCuCount = 5;
	var HorizontalLeakedCount = 5;
	var LPbCount = 9;
	var LCuCount = 4;
	var LLeakedCount = 4;
	var ReverseLPbCount = 9;
	var ReverseLCuCount = 4;
	var ReverseLLeakedCount = 4;
	var TPbCount = 6;
	var TCuCount = 3;
	var TLeakedCount = 3;
	var DeadendPbPbCuPbCount = 3;
	var DeadendLeakedCuCuLeakedCount = 3;
	var DeadendPbLeakedPbPbCount = 3;
	var DeadendPbCuLeakedPbCount = 3;
 	var makeVerticalPbPipeCard = function() {
	    return new Card('VerticalPbPipe', 'Ordinary', 'S', true, false, true, false, 'Pb', null, 'Pb', null);
	};
	var makeVerticalCuPipeCard = function() {
	    return new Card('VerticalPbPipe', 'Ordinary', 'S', true, false, true, false, 'Pb', null, 'Pb', null);
	};
	var makeVerticalLeakedPipeCard = function() {
	    return new Card('VerticalLeakedPipe', 'Leaked', 'S', true, false, true, false, 'Leaked', null, 'Leaked', null);
	};
	var makeHorizontalPbPipeCard = function(){
	    return new Card('HorizontalPbPipe', 'Ordinary', 'Straight', false, true, false, true, null, 'Pb', null, 'Pb');
	};
	var makeHorizontalCuPipeCard = function () {
	    return new Card('HorizontalCuPipe', 'Ordinary', 'Straight', false, true, false, true, null, 'Cu', null, 'Cu');
	};
        var makeHorizontalLeakedPipeCard = function () {
	    return new Card('HorizontalLeakedPipe', 'Leaked', 'Straight', false, true, false, true, null, 'Leaked', null, 'Leaked');
	};
	var makeLPbPipeCard = function (){
	    return new Card('LPbPipe', 'Ordinary', 'L', true, true, false, false, 'Pb', 'Pb', null, null);
	};
	var makeLCuPipeCard = function (){
	    return new Card('LCuPipe', 'Ordinary', 'L', true, true, false, false, 'Cu', 'Cu', null, null);
	};
	var makeLLeakedPipeCard = function () {
	    return new Card('LLeakedPipe', 'Leaked', 'L', true, true, false, false, 'Leaked', 'Leaked', null, null);
	};
	var makeReverseLPbPipeCard = function (){
	    return new Card('ReverseLPbPipe', 'Ordinary', 'ReverseL', true, false, false, true, 'Pb', null, null, 'Pb');
	};
        var makeReverseLCuPipeCard = function () {
	    return new Card('ReverseLCuPipe', 'Ordinary', 'ReverseL', true, false, false,true,'Cu', null, null, 'Cu');
	};
	var makeReverseLLeakedPipeCard = function () {
	    return new Card('ReverseLLeakedPipe', 'Leaked', 'ReverseL', true, false, false,true,'Leaked', null, null, 'Leaked');
	};
	var makeTPbPipeCard = function (){
	    return new Card('TPbPipe', 'Ordinary', 'T', false, true, true, true, null, 'Pb', 'Pb', 'Pb');
	};
	var makeTCuPipeCard = function (){
	    return new Card('TCuPipe', 'Ordinary', 'T', false, true, true, true, null, 'Cu', 'Cu', 'Cu');
	};
	var makeTLeakedPipeCard = function () {
	    return new Card('TLeakedPipe', 'Leaked', 'T', false, true, true, true, null, 'Leaked', 'Leaked', 'Leaked');
	};
	var makeDeadendPbCuLeakedPbPipeCard = function () {
	    return new Card('DeadEndPbCuLeakedPbPipe', 'Deadend', 'Deadend', true, true, true, true, 'Pb', 'Cu', 'Leaked', 'Pb');
	};
        var makeDeadendPbLeakedPbPbPipeCard = function () {
	    return new Card('DeadEndPbLeakedPbPbPipe', 'Deadend', 'Deadend', true, true, true, true, 'Pb', 'Leaked', 'Pb', 'Pb');
	};
	var makeDeadendLeakedCuCuLeakedPipeCard = function () {
	    return new Card('DeadEndLeakedCuCuLeakedPipe', 'Deadend', 'Deadend', true, true, true, true, 'Leaked', 'Cu', 'Cu', 'Leaked');
	};
	var makeDeadendPbPbCuPbPipeCard = function () {
	    return new Card('PbPbCuPbPipe', 'Deadend', 'Deadend', true, true, true, true, 'Pb', 'Pb', 'Cu', 'Pb');
	};
	var pushCard = function(count, makeCardFunc){
	    for(var i=0;i<count;++i){
 		cards.push(makeCardFunc());
	    }
	};
	var shuffle = function(){
	    var size = cards.length;
	    for(var i = size - 1; i > 0; --i){
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = cards[i];
                cards[i] = cards[j];
		cards[j] = tmp;
	    }
	};
	pushCard(VerticalPbCount,makeVerticalPbPipeCard);
	pushCard(VerticalCuCount,makeVerticalCuPipeCard);
	pushCard(VerticalLeakedCount,makeVerticalLeakedPipeCard);
	pushCard(HorizontalPbCount,makeHorizontalPbPipeCard);
	pushCard(HorizontalCuCount,makeHorizontalCuPipeCard);
	pushCard(HorizontalLeakedCount,makeHorizontalLeakedPipeCard);
	pushCard(LPbCount,makeLPbPipeCard);
	pushCard(LCuCount,makeLCuPipeCard);
	pushCard(LLeakedCount,makeLLeakedPipeCard);
	pushCard(ReverseLPbCount,makeReverseLPbPipeCard);
	pushCard(ReverseLCuCount,makeReverseLCuPipeCard);
	pushCard(ReverseLLeakedCount,makeReverseLLeakedPipeCard);
	pushCard(TPbCount,makeTPbPipeCard);
	pushCard(TCuCount,makeTCuPipeCard);
	pushCard(TLeakedCount,makeTLeakedPipeCard);
	pushCard(DeadendPbPbCuPbCount,makeDeadendPbPbCuPbPipeCard);
	pushCard(DeadendPbLeakedPbPbCount,makeDeadendPbLeakedPbPbPipeCard);
	pushCard(DeadendPbCuLeakedPbCount,makeDeadendPbCuLeakedPbPipeCard);
	pushCard(DeadendLeakedCuCuLeakedCount,makeDeadendLeakedCuCuLeakedPipeCard);
	shuffle();
    };
    this.pop = function() {
        return this.cards.pop();
    };

    init(this.cards);
};

module.exports = Deck;
