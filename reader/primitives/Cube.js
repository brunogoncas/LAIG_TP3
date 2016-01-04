function Cube(scene) {
    CGFobject.call(this, scene);

    this.quad = new Rectangle(scene, -0.5, 0.5, 0.5, -0.5, 1, 1);
};

Cube.prototype = Object.create(CGFobject.prototype);
Cube.prototype.constructor = Cube;

Cube.prototype.display = function () {
    // front face
    this.scene.pushMatrix();
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // back face
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 0.5);
    this.scene.rotate(180 * (Math.PI / 180), 1, 0, 0);
    this.quad.display();
    this.scene.popMatrix();

    // top face
    this.scene.pushMatrix();
    this.scene.rotate(90 * (Math.PI / 180), 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // back face
    this.scene.pushMatrix();
    this.scene.rotate(-90 * (Math.PI / 180), 1, 0, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // right face
    this.scene.pushMatrix();
    this.scene.rotate(-90 * (Math.PI / 180), 0, 1, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();

    // left face
    this.scene.pushMatrix();
    this.scene.rotate(90 * (Math.PI / 180), 0, 1, 0);
    this.scene.translate(0, 0, -0.5);
    this.quad.display();
    this.scene.popMatrix();
};

Cube.prototype.updateTexCoords = function (S, T) {

};
