var Card = function(name, type, shape, topIsConnected, rightIsConnected, bottomIsConnected, leftIsConnected, topMaterial, rightMaterial, bottomMaterial, leftMaterial){
    this.name = name;
    this.type = type;
    this.shape = shape;
    this.isRotate = false;
    this.topIsConnected = topIsConnected;
    this.rightIsConnected = rightIsConnected;
    this.bottomIsConnected = bottomIsConnected;
    this.leftIsConnected = leftIsConnected;
    this.topMaterial = topMaterial;
    this.rightMaterial = rightMaterial;
    this.bottomMaterial = bottomMaterial;
    this.leftMaterial = leftMaterial;
    this.rotate = function(){
	var tmp;
        tmp = this.topIsConnected;
	this.topIsConnected = this.bottomIsConnected;
	this.bottomIsConnected = tmp;
	tmp = this.rightIsConnected;
	this.rightIsConnected= this.leftIsConnected;
	this.leftIsConnected = tmp;
	tmp = this.topMaterial;
	this.topMaterial = this.bottomMaterial;
	this.bottomMaterial = tmp;
	tmp = this.rightMaterial;
	this.rightMaterial = this.leftMaterial;
	this.leftMaterial = tmp;

	if(this.isRotate === true) this.isRotate = false;
	else this.isRotate = true;
    };
};

module.exports = Card;
