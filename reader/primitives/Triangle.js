function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3, S, T) {
    CGFobject.call(this, scene);

    this.x1 = x1;
    this.y1 = y1;
    this.z1 = z1;

    this.x2 = x2;
    this.y2 = y2;
    this.z2 = z2;

    this.x3 = x3;
    this.y3 = y3;
    this.z3 = z3;

    this.S = S;
    this.T = T;

    this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function () {

    /*
     B

     A		C
     */

    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];

    this.indices = [
        0, 1, 2,
    ];

    var vA = vec3.fromValues(this.x1, this.y1, this.z1);
    var vB = vec3.fromValues(this.x2, this.y2, this.z2);
    var vC = vec3.fromValues(this.x3, this.y3, this.z3);

    //Normals
    var AB = vec3.create();
    vec3.sub(AB, vB, vA);

    var AC = vec3.create();
    vec3.sub(AC, vC, vA);

    var N = vec3.create();
    vec3.cross(N, AB, AC);
    vec3.normalize(N, N);

    this.normals = [
        N[0], N[1], N[2],
        N[0], N[1], N[2],
        N[0], N[1], N[2],
    ];

    var ang = Math.acos(vec3.dot(AB, AC) / (vec3.len(AB) * vec3.len(AC))); //Scalar product
    var C = [Math.cos(ang) * vec3.len(AC), Math.sin(ang) * vec3.len(AC)];

    this.baseTexCoords = [
        0, 0,
        vec3.length(AB), 0,
        C[0], C[1]
    ];

    this.texCoords = this.baseTexCoords.slice();

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Triangle.prototype.updateTexCoords = function (S, T) {

    for (var i = 0; i < this.texCoords.length; i += 2) {
        this.texCoords[i] = this.baseTexCoords[i] / S;
        this.texCoords[i + 1] = this.baseTexCoords[i + 1] / T;
    }

    this.updateTexCoordsGLBuffers();
};