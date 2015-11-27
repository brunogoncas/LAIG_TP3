function Rectangle(scene, x1, x2, y1, y2, S, T) {
    CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
	this.S = S;
	this.T = T;

    this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function () {
    
/*   _ _ _ _
    |0	   2|
	|		|
	|       |
	|1     3|
	 - - - -
*/
	
    this.vertices = [
        this.x1, this.x2, 0,
        this.x1, this.y2, 0,
        this.y1, this.x2, 0,
        this.y1, this.y2, 0
    ];

    this.indices = [
        0, 1, 2,
        3, 2, 1
    ];

    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.baseTexCoords = [
        0, 0,
        0, Math.abs(this.x2 - this.y2),
        Math.abs(this.y1 - this.x1), 0,
        Math.abs(this.y1 - this.x1), Math.abs(this.x2 - this.y2)
    ];

    this.texCoords = this.baseTexCoords.slice();

    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Rectangle.prototype.updateTexCoords = function(S, T) {

    for (var i = 0; i < this.texCoords.length; i += 2) {
        this.texCoords[i] = this.baseTexCoords[i] / S;
        this.texCoords[i+1] = this.baseTexCoords[i+1] / T;
    }

    this.updateTexCoordsGLBuffers();
};