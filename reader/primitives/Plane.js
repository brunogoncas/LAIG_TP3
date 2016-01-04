function Plane(scene, parts, S, T) {
    CGFobject.call(this, scene);

    this.parts = parts;
    this.scene = scene;

    this.surface;

    this.init();
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.init = function () {

    var degree = 1;
    var knots = [0, 0, 1, 1];

    var controlvertexes = [[[0.5, 0, -0.5, 1], [0.5, 0, 0.5, 1]], [[-0.5, 0, -0.5, 1], [-0.5, 0, 0.5, 1]]];

    var nurbsSurface = new CGFnurbsSurface(degree, degree, knots, knots, controlvertexes);
    getSurfacePoint = function (u, v) {
        return nurbsSurface.getPoint(u, v);
    };

    this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.parts, this.parts);

};

Plane.prototype.display = function () {
    this.surface.display();
};

Plane.prototype.updateTexCoords = function (S, T) {

};