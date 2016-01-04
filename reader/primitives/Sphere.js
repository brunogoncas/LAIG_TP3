var deg2rad = Math.PI / 180;

function Sphere(scene, radius, parts_along_radius, parts_per_section, S, T) {
    CGFobject.call(this, scene);

    this.radius = radius;
    this.parts_along_radius = parts_along_radius; //slices
    this.parts_per_section = parts_per_section; //parts_per_section

    this.S = S;
    this.T = T;

    this.initBuffers();
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function () {
    var ang_0 = 360 * deg2rad / this.parts_along_radius;
    var ang_1 = 180 * deg2rad / this.parts_per_section;

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    var ang_1_now = 0;
    var ang_1_then = ang_1;
    var ind_j = 0;
    var aux_j = 4 * this.parts_along_radius;

    for (j = 0; j < this.parts_per_section; j++) {

        var ang_0_now = 0;
        var ind_i = 0;

        for (i = 0; i < this.parts_along_radius; i++) {

            var x0 = this.radius * Math.sin(ang_1_now) * Math.cos(ang_0_now);
            var y0 = this.radius * Math.cos(ang_1_now);
            var z0 = this.radius * Math.sin(ang_1_now) * Math.sin(ang_0_now);

            var x2 = this.radius * Math.sin(ang_1_then) * Math.cos(ang_0_now);
            var y2 = this.radius * Math.cos(ang_1_then);
            var z2 = this.radius * Math.sin(ang_1_then) * Math.sin(ang_0_now);

            ang_0_now += ang_0;

            var x1 = this.radius * Math.sin(ang_1_now) * Math.cos(ang_0_now);
            var y1 = this.radius * Math.cos(ang_1_now);
            var z1 = this.radius * Math.sin(ang_1_now) * Math.sin(ang_0_now);

            var x3 = this.radius * Math.sin(ang_1_then) * Math.cos(ang_0_now);
            var y3 = this.radius * Math.cos(ang_1_then);
            var z3 = this.radius * Math.sin(ang_1_then) * Math.sin(ang_0_now);

            //V0
            this.vertices.push(x0);
            this.vertices.push(y0);
            this.vertices.push(z0);

            //V1
            this.vertices.push(x1);
            this.vertices.push(y1);
            this.vertices.push(z1);

            //V2
            this.vertices.push(x2);
            this.vertices.push(y2);
            this.vertices.push(z2);

            //V3
            this.vertices.push(x3);
            this.vertices.push(y3);
            this.vertices.push(z3);

            var ind_i_j = ind_i + ind_j;

            //0,1,2
            this.indices.push(ind_i_j);
            this.indices.push(ind_i_j + 1);
            this.indices.push(ind_i_j + 2);

            //3,2,1
            this.indices.push(ind_i_j + 3);
            this.indices.push(ind_i_j + 2);
            this.indices.push(ind_i_j + 1);

            ind_i += 4;

            //NV0
            this.normals.push(x0);
            this.normals.push(y0);
            this.normals.push(z0);

            //NV1
            this.normals.push(x1);
            this.normals.push(y1);
            this.normals.push(z1);

            //NV2
            this.normals.push(x2);
            this.normals.push(y2);
            this.normals.push(z2);

            //NV3
            this.normals.push(x3);
            this.normals.push(y3);
            this.normals.push(z3);

            this.texCoords.push(1 - i / this.parts_along_radius, j / this.parts_per_section);
            this.texCoords.push(1 - (i + 1) / this.parts_along_radius, j / this.parts_per_section);
            this.texCoords.push(1 - i / this.parts_along_radius, (j + 1) / this.parts_per_section);
            this.texCoords.push(1 - (i + 1) / this.parts_along_radius, (j + 1) / this.parts_per_section);
        }

        ang_1_now += ang_1;
        ang_1_then += ang_1;
        ind_j += aux_j;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Sphere.prototype.updateTexCoords = function (S, T) {

    this.updateTexCoordsGLBuffers();
};