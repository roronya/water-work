var Box =function(card, isLeaked, isRepaired){
    this.card = card;
    this.isLeaked = isLeaked;
    this.isRepaired = isRepaired;
    this.isRepairedByWrench = false;
};

module.exports = Box;
