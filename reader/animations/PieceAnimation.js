function PieceAnimation(scene, span, controlPoints) {
	this.span = span;
	
	this.timeElapsed = 0;
	
	this.done = false;
	
	this.stage = 0;
	
	this.lastAnimation = [];
	
	this.timeElapsedDelta = 0;
	
	
	var controlPointsAux = [];
	
	controlPointsAux.push(controlPoints[0]);
	
	var controlPoint = [];
	controlPoint["x"] = controlPoints[0]["x"];
	controlPoint["y"] = controlPoints[0]["y"] + 1.5;
	controlPoint["z"] = controlPoints[0]["z"];
	controlPointsAux.push(controlPoint);
	
	controlPoint = [];
	controlPoint["x"] = controlPoints[1]["x"];
	controlPoint["y"] = controlPoints[1]["y"] + 1.5;
	controlPoint["z"] = controlPoints[1]["z"];
	controlPointsAux.push(controlPoint);
	
	controlPointsAux.push(controlPoints[1]);
	
};

PieceAnimation.prototype = Object.create(Object.prototype);
PieceAnimation.prototype.constructor = PieceAnimation;

PieceAnimation.prototype.animate = function (delta) {

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
	diff['x'] = this.controlPoints[this.stage + 1]['x'] - this.controlPoints[this.stage]['x'];
	diff['y'] = this.controlPoints[this.stage + 1]['y'] - this.controlPoints[this.stage]['y'];
	diff['z'] = this.controlPoints[this.stage + 1]['z'] - this.controlPoints[this.stage]['z'];
	
	diff['x'] = diff['x'] * currentPointDiff;
	diff['y'] = diff['y'] * currentPointDiff;
	diff['z'] = diff['z'] * currentPointDiff;
	
    if (this.stage >= this.controlPoints.length) {
        this.lastAnimation['x'] = this.controlPoints[this.controlPoints.length - 1]['x'];
		this.lastAnimation['y'] = this.controlPoints[this.controlPoints.length - 1]['y'];
		this.lastAnimation['z'] = this.controlPoints[this.controlPoints.length - 1]['z'];
        
        return;
    }
	
	this.lastAnimation['x'] = this.controlPoints[this.stage]['x'] + diff['x'];
	this.lastAnimation['y'] = this.controlPoints[this.stage]['y'] + diff['y'];
	this.lastAnimation['z'] = this.controlPoints[this.stage]['z'] + diff['z'];
	
	
};