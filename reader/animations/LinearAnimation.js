function LinearAnimation(scene, span, controlPoints) {
	this.span = span;
	this.controlPoints = controlPoints;
   	
	this.timeElapsed = 0;
	
	this.done = false;
	
	this.stage = 0;
   
	this.lastAnimation = [];
	this.lastRotation = 0;
	
	this.timeElapsedDelta = 0;
	
};

LinearAnimation.prototype = Object.create(Object.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.animate = function (delta) {

    if (this.timeElapsed >= this.span) {
		this.done = true;
        return;
    }
	
	//soma tempo decorrido
	this.timeElapsed += delta;
	
	//calcula o tempo que tem que demorar em cada ponto
	var controlPointDelta = this.span / (this.controlPoints.length - 1);
	
	this.timeElapsedDelta += delta;

	if (this.timeElapsedDelta > controlPointDelta) {
        this.timeElapsedDelta -= controlPointDelta;
        this.stage++;
    }

	if (this.stage == this.controlPoints.length - 1)
		return;
	
	var currentPointDiff = this.timeElapsedDelta / controlPointDelta;
		
	var diff = [];
	diff['x'] = this.controlPoints[this.stage + 1]['xx'] - this.controlPoints[this.stage]['xx'];
	diff['y'] = this.controlPoints[this.stage + 1]['yy'] - this.controlPoints[this.stage]['yy'];
	diff['z'] = this.controlPoints[this.stage + 1]['zz'] - this.controlPoints[this.stage]['zz'];
	
	diff['x'] = diff['x'] * currentPointDiff;
	diff['y'] = diff['y'] * currentPointDiff;
	diff['z'] = diff['z'] * currentPointDiff;
	
    if (this.stage >= this.controlPoints.length) {
        this.lastAnimation['x'] = this.controlPoints[this.controlPoints.length - 1]['xx'];
		this.lastAnimation['y'] = this.controlPoints[this.controlPoints.length - 1]['yy'];
		this.lastAnimation['z'] = this.controlPoints[this.controlPoints.length - 1]['zz'];
        
        return;
    }
	
	this.lastAnimation['x'] = this.controlPoints[this.stage]['xx'] + diff['x'];
	this.lastAnimation['y'] = this.controlPoints[this.stage]['yy'] + diff['y'];
	this.lastAnimation['z'] = this.controlPoints[this.stage]['zz'] + diff['z'];
	
	
	//Rotacao
	if(this.stage > 0) {
		this.lastRotation = this.calcAngle(this.controlPoints[this.stage+1]['xx'] - this.controlPoints[this.stage]['xx'],
		this.controlPoints[this.stage+1]['zz'] - this.controlPoints[this.stage]['zz']);
		
	}
	
};

LinearAnimation.prototype.calcAngle = function (delta_x, delta_z) {
	var angle = 0;
	
	if (delta_x == 0 && delta_z == 0)
		return 0;
	
	else if (delta_x == 0) {
		
		if (delta_z > 0)
			return 0;
		else
			return 180 * (Math.PI/180);	
	}
	
	else if (delta_z == 0) {
		
		if (delta_x > 0)
			return 90 * (Math.PI/180);
		else
			return -90 * (Math.PI/180);	
	} 
	
	else
		angle = Math.atan2(delta_x, delta_z);
		
	return angle;

};

LinearAnimation.prototype.reset = function () {
	this.timeElapsed = 0;
	
	this.lastAnimation = [];
	this.lastRotation = 0;
	
	this.done = false;
	this.stage = 0;
	
	this.timeElapsedDelta = 0;

};