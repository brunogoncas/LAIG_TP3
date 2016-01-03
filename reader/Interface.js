function Interface(scene) {
    //call CGFinterface constructor
    CGFinterface.call(this);

    this.scene = scene;
    scene.interface = this;
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function (application) {
    // call CGFinterface init
    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();

    this.gui.add(this.scene, 'Undo').name("Anular Jogada");

	this.gui.add(this.scene, 'gametype', this.scene.gametypes).name("Modo de Jogo");

	this.gui.add(this.scene, 'level', this.scene.levels).name("Dificuldade do Jogo");

    this.gui.add(this.scene, 'ambiente', this.scene.ambientes).name("Ambiente de Jogo");

    this.gui.add(this.scene, 'movieofgame').name("Filme do jogo");

    return true;
};
