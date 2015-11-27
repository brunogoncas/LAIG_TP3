function Cylinder(scene, heigth, bottom_radius, top_radius, sections_along_heigth, parts_per_section, S, T){
    CGFobject.call(this, scene);

    this.heigth = heigth;
    this.bottom_radius = bottom_radius;
    this.top_radius = top_radius;
    this.sections_along_heigth = sections_along_heigth;
    this.parts_per_section = parts_per_section;
	
	this.shell = new CylinderShell(this.scene, heigth, bottom_radius, top_radius, sections_along_heigth, parts_per_section);
	this.circ = new CylinderCircle(this.scene, parts_per_section);
};

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.translate(0,0,this.heigth);
		this.scene.scale(this.top_radius,this.top_radius,1);
		this.circ.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.shell.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(-Math.PI, 1, 0, 0);
		this.scene.translate(0,0,0);
		this.scene.scale(this.bottom_radius,this.bottom_radius,1);
		this.circ.display();
	this.scene.popMatrix();
};

Cylinder.prototype.updateTexCoords = function(S, T) {

};
