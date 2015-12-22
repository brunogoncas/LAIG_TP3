function Piece(scene, id, player, posX, posZ, inGame, material, texture) {
    CGFobject.call(this, scene);
	
    this.id = id;
	this.player = player;
	this.posX = posX;
	this.posZ = posZ;
	this.inGame = inGame;
	
	this.material = material;
	this.texture = texture;
	
	this.body = new Cylinder(scene, 0.5, 1, 1, 20, 20, 1, 1);
};

Piece.prototype = Object.create(Object.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.display = function() {
	
	//body
	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		//this.scene.translate(-2,0,0);
		
		this.material.setTexture(this.texture);
		this.material.apply();
		
		this.body.display();
	this.scene.popMatrix();

};