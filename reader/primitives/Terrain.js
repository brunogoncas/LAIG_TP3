function Terrain(scene, texture, heightmap, S, T){
    CGFobject.call(this,scene);
	
	this.scene = scene;
	this.texture = new CGFtexture(this.scene, texture);
	this.heightmap = new CGFtexture(this.scene, heightmap);
	
	this.appearance = new CGFappearance(this.scene);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);
	this.appearance.setTexture(this.texture);
	this.appearance.setTextureWrap('REPEAT', 'REPEAT');
	
	this.terrainPlane = new Plane(this.scene, 200, 1, 1);
	
	this.terrainShader = new CGFshader(scene.gl, "scenes/shaders/terrain.vert", "scenes/shaders/terrain.frag");
	this.terrainShader.setUniformsValues({uSampler2: 1});
	this.terrainShader.setUniformsValues({scale_factor: 0.25});
};

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display = function() {
	this.scene.pushMatrix();
	
		this.scene.translate(-70,-23,-60);
		this.scene.scale(300,300,300);
		this.appearance.apply();
		this.heightmap.bind(1);
		
		this.scene.setActiveShader(this.terrainShader);
		this.terrainPlane.display();
		this.scene.setActiveShader(this.scene.defaultShader);
	
	this.scene.popMatrix();
};

Terrain.prototype.updateTexCoords = function(S, T) {

};