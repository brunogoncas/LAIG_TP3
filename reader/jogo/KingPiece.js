function KingPiece(scene, id, player, posX, posZ, inGame, bodyMaterial, bodyTexture, crownTexture){
    CGFobject.call(this, scene);

    this.id = id;
	this.player = player;
	this.posX = posX;
	this.posZ = posZ;
	this.inGame = inGame;
	
	this.bodyMaterial = bodyMaterial;
	this.bodyTexture = bodyTexture;
	
	this.body = new Cylinder(scene, 0.5, 1, 1, 20, 20, 1, 1);
	this.crown = new Cube(scene);
	
	this.crownTexture = crownTexture;
};

KingPiece.prototype = Object.create(CGFobject.prototype);
KingPiece.prototype.constructor = KingPiece;

KingPiece.prototype.display = function() {
	
	//body
	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		//this.scene.translate(-2,0,0);
		
		this.bodyMaterial.setTexture(this.bodyTexture);
		this.bodyMaterial.apply();
		
		this.body.display();
	this.scene.popMatrix();
	
	//crown
	//vertical
	this.scene.pushMatrix();
		this.scene.translate(0,0.5,0);
		this.scene.scale(0.4,1.8,0.1);
		
		this.bodyMaterial.setTexture(this.crownTexture);
		this.bodyMaterial.apply();
		
		this.crown.display();
	this.scene.popMatrix();

	//horizontal
	this.scene.pushMatrix();
		this.scene.translate(0,0.9,0);
		this.scene.scale(1,0.4,0.1);
				
		this.bodyMaterial.setTexture(this.crownTexture);
		this.bodyMaterial.apply();
		
		this.crown.display();
	this.scene.popMatrix();

};
