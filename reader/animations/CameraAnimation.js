function CameraAnimation(scene, span, angle) {
    CGFobject.call(this, scene);
    this.span = span;
    this.angle = angle;
    this.timeElapsed = 0;
    this.done = false;
    this.totalangle = 0;


};

CameraAnimation.prototype = Object.create(Object.prototype);
CameraAnimation.prototype.constructor = CameraAnimation;


CameraAnimation.prototype.animate = function (delta) {

    if (this.timeElapsed >= this.span) {
        this.done = true;
        return;
    }

    //soma tempo decorrido
    this.timeElapsed += delta;

    //calcula o angulo a rodar no delta time
    var currangle = this.angle * (delta / this.span);
    this.totalangle = this.totalangle + currangle;
    if (this.totalangle >= this.angle) {
        currangle = this.angle - this.lastangle;
    }
    this.lastangle = this.totalangle;

    this.scene.camera.orbit(vec3.fromValues(0, 0, 0), currangle * Math.PI / 180);

};
