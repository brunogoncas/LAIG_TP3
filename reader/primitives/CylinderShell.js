function CylinderShell(scene, heigth, bottom_radius, top_radius, sections_along_height, parts_per_section) {
    CGFobject.call(this, scene);

    this.height = heigth;
	this.bottom_radius = bottom_radius;
	this.top_radius = top_radius;
    this.sections_along_height = sections_along_height;
    this.parts_per_section = parts_per_section;
	
    this.initBuffers();
};

CylinderShell.prototype = Object.create(CGFobject.prototype);
CylinderShell.prototype.constructor = CylinderShell;

CylinderShell.prototype.initBuffers = function () {
    var sectWidth = 1 / this.sections_along_height;
    var deltaRadius = (this.bottom_radius - this.top_radius) / this.sections_along_height;
    var angle = (2 * Math.PI) / this.parts_per_section;

    this.vertices = [];
    this.normals = [];
	this.indices = [];
    this.texCoords = [];

    for (var part = 0; part < this.parts_per_section + 1; part++) {
        for (var sect = 0; sect < this.sections_along_height + 1; sect++) {
            var radius = this.bottom_radius - deltaRadius * sect;

            this.vertices.push(
                radius * Math.cos(angle * part),
                radius * Math.sin(angle * part),
                (sect * sectWidth) * this.height
            );

            this.normals.push(
                radius * Math.cos(angle * part),
                radius * Math.sin(angle * part),
                0
            );

            this.texCoords.push(
                1 - part / this.parts_per_section,
                sect / this.sections_along_height
            );
        }
    }

    for (part = 0; part < this.parts_per_section; part++) {
        for(sect = 0; sect < this.sections_along_height; sect++){
            var partN = (this.sections_along_height + 1) * part;
            this.indices.push(
                sect + partN,
                sect + partN + this.sections_along_height + 1,
                sect + partN + 1
            );
            
			this.indices.push(
                sect + partN + 1 ,
                sect + partN + this.sections_along_height + 1,
                sect + partN + this.sections_along_height + 2
            );
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};