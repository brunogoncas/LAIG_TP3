function CircularAnimation(scene, span, center, radius, startang, rotang) {

	this.span = span;
    this.center = center;
	this.radius = radius;
    this.startang = startang;
    this.rotang = rotang;

	this.timeElapsed = 0;
	
	this.done = false;
	
	this.lastAnimation = [];
	this.lastRotation = 0;
	
};

CircularAnimation.prototype = Object.create(Object.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.animate = function (delta) {
    
    if (this.timeElapsed >= this.span) {
        this.done = true;
        return;
    }
    
    this.timeElapsed += delta;
    
    var totalToPerform = this.rotang - this.startang;
    var currentAngle = this.startang + totalToPerform * (this.timeElapsed / this.span);
	
	var previousAnim = [];
	previousAnim["x"] = this.lastAnimation["x"];
	previousAnim["z"] = this.lastAnimation["z"];
	
	this.lastAnimation["x"] = this.center["x"] + (Math.cos(currentAngle) * this.radius);
    this.lastAnimation["y"] = this.center["y"];
	this.lastAnimation["z"] = this.center["z"] + (Math.sin(currentAngle) * this.radius);
	
	this.lastRotation = Math.atan2(
		this.lastAnimation['x'] - previousAnim["x"],
		this.lastAnimation['z'] - previousAnim["z"]);

};

CircularAnimation.prototype.reset = function () {
	this.timeElapsed = 0;
	
	this.lastAnimation = [];
	this.lastRotation = 0;
	
	this.done = false;
};