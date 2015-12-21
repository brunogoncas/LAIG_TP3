function Interface(scene) {
	//call CGFinterface constructor
	CGFinterface.call(this);

	this.scene = scene;
	scene.interface = this;
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	return true;
};

Interface.prototype.addLights = function() {

	//lights control
	this.gui.add(this.scene, 'All_Lights').name("Todas as luzes");
	this.scene.tickLights = [];

/*	var group = this.gui.addFolder("Luzes");

	//Add ligths
	for (i = 0; i < this.scene.lightsScene.length; i++) {
		this.scene.tickLights[i] = group.add(this.scene.lightsScene[i]['light'], 'enabled').name('Luz '+(i+1));
	}

	var group2 = this.gui.addFolder("Animações");
	//this.scene.animating = group2.add(this.scene, 'animating').name('Stop/Resume Animation');
	//this.scene.resume = group2.add(this.scene, 'resume').name('Reset Animation');
	group2.add(this.scene, 'anim').name('Stop/Resume Animations');
	group2.add(this.scene, 'reset').name('Reset Animations'); */

	/*var group3 = this.gui.addFolder("Nivel de dificuldade");
	for (i=0;i<this.scene.levels.length;i++){
		group3.add(this.scene, 'changelevel', this.scene.levels[i]).name('Nivel '+ this.scene.levels[i]);
	}

	var group4 = this.gui.addFolder("Tipo de jogo");
	for (i=0;i<this.scene.gametypes.length;i++){
		group4.add(this.scene, 'changetype', this.scene.gametypes[i]).name( this.scene.gametypes[i]);
	}

	this.gui.add(this.scene, 'undo').name("Undo");*/


};
