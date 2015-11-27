function Patch(scene, order, partsU, partsV, controlPoints, S, T){
    CGFobject.call(this,scene);
	
	this.scene = scene;
	this.order = order;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = controlPoints;
	
	this.surface;

	this.init();
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.init = function() {

	var knots = [];

	var controlvertexes = [];
	var controlvertexesU = [];
	
	for (var i = 0; i <= (this.order*2)+1; i++) {
		if (i <= this.order) 
			knots.push(0);
			
		else
			knots.push(1);
	}

	for (var uOrder = 0; uOrder <= this.order; ++uOrder) {
        for (var vOrder = 0; vOrder <= this.order; ++vOrder) {
            var element = uOrder * (this.order+1) + vOrder;
            controlvertexesU.push(this.controlPoints[element]);			
		}
		controlvertexes.push(controlvertexesU);
		controlvertexesU = [];
	}

	var nurbsSurface = new CGFnurbsSurface(this.order, this.order, knots, knots, controlvertexes);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	var obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
	//obj.primitiveType = this.scene.gl.LINES;
	this.surface = obj;

};

Patch.prototype.display = function() {
	this.surface.display();
};

Patch.prototype.updateTexCoords = function(S, T) {

};