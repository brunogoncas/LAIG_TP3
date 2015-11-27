function Vehicle(scene, S, T){
    CGFobject.call(this, scene);

	var controlpoints = [];
	controlpoints.push([-0.5,  0, -0.5, 1]);
	controlpoints.push([-0.5,  0, -0.25, 1]);
	controlpoints.push([-0.5,  0, 0.25, 1]);
	controlpoints.push([-0.5,  0, 0.5, 1]);
	controlpoints.push([-0.25, 0, -0.5, 1]);
	controlpoints.push([-0.25, 1, -0.25, 1]);
	controlpoints.push([-0.25, 1, 0.25, 1]);
	controlpoints.push([-0.25, 0, 0.5, 1]);
	controlpoints.push([0.25,  0, -0.5, 1]);
	controlpoints.push([0.25,  1, -0.25, 1]);
	controlpoints.push([0.25,  1, 0.25, 1]);
	controlpoints.push([0.25,  0, 0.5 , 1]);
	controlpoints.push([0.5,   0, -0.5, 1]);
	controlpoints.push([0.5,   0, -0.25, 1]);
	controlpoints.push([0.5,   0, 0.25, 1]);
	controlpoints.push([0.5,   0, 0.5, 1]);
	
	this.patch = new Patch(this.scene, 3, 10, 10, controlpoints, 1, 1);
	this.base = new Cylinder(this.scene, 0.8, 0.7, 1.6, 20, 20, 1, 1);
    
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
	
	this.scene.pushMatrix();
		this.scene.scale(-1,1,1);
		this.scene.rotate(0,0,1,-Math.PI);
		this.scene.scale(2,2,2);
		this.patch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.scene.scale(2,2,2);
		this.base.display();
	this.scene.popMatrix();
	
};

Vehicle.prototype.updateTexCoords = function(S, T) {

};
