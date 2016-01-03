function Scene() {
    CGFscene.call(this);
    this.graph = [];
}
var pickingindex;
var count;

Scene.prototype = Object.create(CGFscene.prototype);
Scene.prototype.constructor = Scene;

Scene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.enable(this.gl.CULL_FACE);
    // this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);
    // this.gl.depthMask(false);

    this.enableTextures(true);

    this.graphRootId = [];
    this.nodeGraph = [];
    this.root_node = [];

    this.camera.near;
    this.camera.far;
    this.matrixInit;
    this.reference;


    this.leaves = [];
    this.materials = [];
    this.textures = [];
    this.nodes = [];
    this.animations = [];

    this.lastTimeUpdate = 0;

    this.defaultAppearance = new CGFappearance(this);
    this.defaultAppearance.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setShininess(10.0);

    this.placardAppearance = new CGFappearance(this);
    this.placardAppearance.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.placardAppearance.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.placardAppearance.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.placardAppearance.setShininess(10.0);

    this.animating = true;

    this.setUpdatePeriod(20);

    this.initLevels();

    this.inittypes();

    initRequest();

    this.gameState = new GameState();

    this.ambiente = "Quarto";

    this.ambientes = ["Quarto", "Piquenique"];

    this.gametype = "HvsH";
  	this.gametypes = ["HvsH", "HvsM", "MvsM"];
    this.level = "Normal";
  	this.levels = ["Fácil", "Normal", "Difícil"];

    this.fontTexture = new CGFtexture(this, "scenes/1/textures/oolite-font.png");
    this.placardAppearance.setTexture(this.fontTexture);
    // plane where texture character will be rendered
    this.plane = new SimplePlane(this);
    this.textShader = new CGFshader(this.gl, "scenes/shaders/font.vert", "scenes/shaders/font.frag");
    // set number of rows and columns in font texture
    this.textShader.setUniformsValues({'dims': [16, 16]});

    count=30;
    var t = this;
    counter=setInterval(function(){t.timer();}, 1000);

    this.gamemovie=[];
};

Scene.prototype.SetTimer = function () {
	switch (this.level) {
		case "Fácil":
			timecount=45;
		break;

		case "Normal":
			timecount=25;
		break;

		case "Difícil":
			timecount=10;
		break;
	}
}

Scene.prototype.Undo = function () {

    if (this.gameState.boards.length == 1) {
        return;
    }

    else {
        this.gameState.board = this.gameState.boards[this.gameState.boards.length - 2];
        this.gameState.boards.pop();

        console.log(this.gameState.boardsFromProlog);

    		boardFromProlog = this.gameState.boardsFromProlog[this.gameState.boardsFromProlog.length - 2];
    		this.gameState.boardsFromProlog.pop();
        if (this.gameState.playersTurn == 2)
            this.gameState.playersTurn = 1;

        else
            this.gameState.playersTurn = 2;

        this.gameState.state = 0;

        this.initGame();

        this.gameState.undo = true;


    }

};

Scene.prototype.anim = function () {
    if (this.animating)
        this.animating = false;
    else
        this.animating = true;

};

Scene.prototype.reset = function () {
    for (var NodeIndex in this.nodes) {
        var node = this.nodes[NodeIndex];
        if (node.animations.length != 0) {

            for (var i = 0; i < node.animations.length; i++) {
                node.animationsObj[i].reset();
            }
            this.nodes[NodeIndex].currentAnimation = 1;
        }
    }
};

Scene.prototype.update = function (time) {
    if (this.gameState.animating) {

        var diff = (time - this.lastTimeUpdate) / 1000;
        this.lastTimeUpdate = time;

        this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].animation.animate(diff);

        //Se termina a animacao muda de jogador
        if (this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].animation.done) {
			this.cameraanimation.animate(diff);

			if(this.cameraanimation.done) {
				this.gameState.animating = false;

				if (this.gameState.playersTurn == 1)
					this.gameState.playersTurn = 2;

				else
					this.gameState.playersTurn = 1;
          clearInterval(counter);
          count=30;
          var t = this;
          counter=setInterval(function(){t.timer();}, 1000);
				this.gameState.state = 0;
			}
        }

        //Atualiza posicoes da animacao
        else {
            var animationPos = this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].animation.lastAnimation;

            this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].posX = animationPos['x'];
            this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].posY = animationPos['y'];
            this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].posZ = animationPos['z'];
        }

         if (this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].animation.done) {

           //Pecas que vao sair de jogo
           if (this.gameState.piecesAnimatingOut.length > 0) {
               this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].animation.animate(diff);

               if (this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].animation.done) {
                   this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].inGame = false;
                   this.gameState.piecesAnimatingOut.pop();
               }

               else {
                   var animationPos = this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].animation.lastAnimation;

                   this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].posX = animationPos['x'];
                   this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].posY = animationPos['y'];
                   this.gameState.Pieces[this.gameState.piecesAnimatingOut[0]].posZ = animationPos['z'];
               }
           }

         }


    }

    else {
      if(this.changeplayer)
      {
        var diff = (time - this.lastTimeUpdate) / 1000;
        this.lastTimeUpdate = time;
        this.cameraanimation.animate(diff);
        console.log(this.cameraanimation.animate.timeElapsed);

        if(this.cameraanimation.done)
        {
          clearInterval(counter);
          count=30;
          var t = this;
          counter=setInterval(function(){t.timer();}, 1000);
            this.changeplayer= false;
        }

      }
        this.lastTimeUpdate = time;
    }
};


Scene.prototype.initLights = function () {

    this.lightsScene = [];
    this.onOff = true;

    for (var i = 0; i < this.graph[this.ambiente].lights.length; i++) {
        var light = new CGFlight(this, i);

        light.setPosition(this.graph[this.ambiente].lights[i]["position"]["x"], this.graph[this.ambiente].lights[i]["position"]["y"], this.graph[this.ambiente].lights[i]["position"]["z"], this.graph[this.ambiente].lights[i]["position"]["w"]);
        light.setAmbient(this.graph[this.ambiente].lights[i]["ambient"]["r"], this.graph[this.ambiente].lights[i]["ambient"]["g"], this.graph[this.ambiente].lights[i]["ambient"]["b"], this.graph[this.ambiente].lights[i]["ambient"]["a"]);
        light.setDiffuse(this.graph[this.ambiente].lights[i]["diffuse"]["r"], this.graph[this.ambiente].lights[i]["diffuse"]["g"], this.graph[this.ambiente].lights[i]["diffuse"]["b"], this.graph[this.ambiente].lights[i]["diffuse"]["a"]);
        light.setSpecular(this.graph[this.ambiente].lights[i]["specular"]["r"], this.graph[this.ambiente].lights[i]["specular"]["g"], this.graph[this.ambiente].lights[i]["specular"]["b"], this.graph[this.ambiente].lights[i]["specular"]["a"]);

        this.lightsScene[i] = [];
        this.lightsScene[i]['enabled'] = false;

        if (this.graph[this.ambiente].lights[i]["enable"]) {
            light.enable();
            this.lightsScene[i]['enabled'] = true;
        }
        else {
            light.disable();
        }
        light.setVisible(false);
        light.update();
        this.lightsScene[i]['light'] = light;
        this.lightsScene[i]['id'] = this.graph[this.ambiente].lights[i]["id"];

    }

    //Add the lights to interface

};


Scene.prototype.initCameras = function () {
    //( fov, near, far, position, target )
    this.camera = new CGFcamera(0.6, 0.1, 500, vec3.fromValues(0, 10, 15), vec3.fromValues(0, 0, 0));

};


// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
Scene.prototype.onGraphLoaded = function () {

    if (this.graph[this.ambiente].reference != 0) {
        this.axis = new CGFaxis(this, this.graph[this.ambiente].reference);
    }

    this.gl.clearColor(this.graph[this.ambiente].background["r"], this.graph[this.ambiente].background["g"], this.graph[this.ambiente].background["b"], this.graph[this.ambiente].background["a"]);
    this.setGlobalAmbientLight(this.graph[this.ambiente].ambient["r"], this.graph[this.ambiente].ambient["g"], this.graph[this.ambiente].ambient["b"], this.graph[this.ambiente].ambient["a"]);

    this.initLights();

    this.camera.near = this.graph[this.ambiente].frustum['near'];
    this.camera.far = this.graph[this.ambiente].frustum['far'];

    this.matrixInit = this.graph[this.ambiente].matrixInit;
    this.reference = this.graph[this.ambiente].reference;


    for (i = 0; i < this.ambientes.length; i++) {
        this.nodes[this.ambientes[i]] = this.graph[this.ambientes[i]].nodes;
        //console.log(this.ambientes[i]);
        this.graphRootId[this.ambientes[i]] = this.graph[this.ambientes[i]].root;
        // console.log(this.nodes[this.ambientes[i]][this.graphRootId[this.ambientes[i]]]);
        this.root_node[this.ambientes[i]] = this.nodes[this.ambientes[i]][this.graphRootId[this.ambientes[i]]];
        // console.log(this.root_node);

        this.leaves[this.ambientes[i]] = this.graph[this.ambientes[i]].leaves;
        this.materials[this.ambientes[i]] = this.graph[this.ambientes[i]].materials;
        this.textures[this.ambientes[i]] = this.graph[this.ambientes[i]].textures;
        this.animations[this.ambientes[i]] = this.graph[this.ambientes[i]].animations;

        for (var NodeIndex in this.nodes[this.ambientes[i]]) {
            if (this.nodes[this.ambientes[i]][NodeIndex].animations.length != 0) {
                for (var animationIndex in this.nodes[this.ambientes[i]][NodeIndex].animations) {

                    var animation = this.animations[this.nodes[this.ambientes[i]][NodeIndex].animations[animationIndex]];
                    this.nodes[this.ambientes[i]][NodeIndex].animationsObj.push(animation);
                }

                this.nodes[this.ambientes[i]][NodeIndex].currentAnimation = 1;
            }
        }
    }

};
/*
 INICIAR TABULEIRO DE JOGO E PECAS
 */
Scene.prototype.initGame = function () {
    var z = 0, x = 0;
    var player;

    this.gameState.Pieces = [];
    for (z = 0; z < this.gameState.board.length; z++) {
        for (x = 0; x < this.gameState.board[z].length; x++) {

            var actualNode;
            var matrixPos = [];
            matrixPos.z = z;
            matrixPos.x = x;

            switch (this.gameState.board[z][x]) {
                case "b":
                    actualNode = this.nodes[this.ambiente]["black_P"];
                    player = 2;

                    var materialDisplay = this.materials[this.ambiente][actualNode.material].appearance;
                    var textureDisplay = this.textures[this.ambiente][actualNode.texture].textureCGF;
                    this.gameState.Pieces.push(new Piece(this, this.gameState.board[z][x], player, (x * 2) + 1, (z * 2) + 1, true, materialDisplay, textureDisplay, this.gameState.Pieces.length, matrixPos));
                    break;

                case "w":
                    actualNode = this.nodes[this.ambiente]["white_P"];
                    player = 1;

                    var materialDisplay = this.materials[this.ambiente][actualNode.material].appearance;
                    var textureDisplay = this.textures[this.ambiente][actualNode.texture].textureCGF;
                    this.gameState.Pieces.push(new Piece(this, this.gameState.board[z][x], player, (x * 2) + 1, (z * 2) + 1, true, materialDisplay, textureDisplay, this.gameState.Pieces.length, matrixPos));
                    break;

                case "k":
                    actualNode = this.nodes[this.ambiente]["king"];
                    player = 1;

                    var materialDisplay = this.materials[this.ambiente][actualNode.material].appearance;
                    var textureDisplay = this.textures[this.ambiente][actualNode.texture].textureCGF;
                    var texture2Display = this.textures[this.ambiente]["gold"].textureCGF;

                    this.gameState.Pieces.push(new KingPiece(this, this.gameState.board[z][x], player, (x * 2) + 1, (z * 2) + 1, true, materialDisplay, textureDisplay, texture2Display, this.gameState.Pieces.length, matrixPos));
                    break;

                default:
                    break;

            }

        }
    }
};


Scene.prototype.All_Lights = function () {
    //if any light is on, turn all off
    //else turn all on
    var nextState = true;

    //check current state
    for (i = 0; i < this.lightsScene.length; i++) {

        if (this.lightsScene[i]['light'].enabled) {
            nextState = false;
            break;
        }
    }

    //apply next state and change in GUI
    for (i = 0; i < this.lightsScene.length; i++) {

        if (nextState) {
            this.lightsScene[i]['light'].enable();
        } else {
            this.lightsScene[i]['light'].disable();
        }

        this.tickLights[i].setValue(nextState);
    }
};

Scene.prototype.display = function () {
  if(this.gametype != this.gameState.gametype)
  this.gameState.gametype = this.gametype;
    if (this.gameState.Pieces.length == 0)
        this.initGame();


    //Board from Prolog
    if (boardFromProlog.length > 0 && (this.gameState.state == 1 || this.gameState.gametype == "MvsM") && this.gameState.undo == false) {
        this.getBoard();
    }

    // Picking
  if(this.gameState.gametype == "HvsH" || (this.gameState.gametype == "HvsM" && this.gameState.playersTurn == 1)) {
    this.logPicking();
    this.clearPickRegistration();
    pickingindex = 1;
  }

    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();


    if (this.graph[this.ambiente].loadedOk) {




      // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

          this.multMatrix(this.matrixInit);
        // activate shader for rendering text characters
        this.setActiveShaderSimple(this.textShader);
        // activate texture containing the font
        this.placardAppearance.apply();
        this.pushMatrix();

        if(this.gameState.playersTurn==1)
        {
          this.translate(-12, -6, -59);
        }
        else {
          this.translate(12, -6, 59);
          this.rotate(Math.PI,0,1,0);
        }

        this.scale(2, 2, 2);


        var stringtoshow = "Player " + this.gameState.playersTurn;

        if(this.gameState.playersTurn==1)
        this.msgtoplayer="Jogue uma peca preta";
        else
        this.msgtoplayer="Jogue uma peca branca";


        for (i = 0; i <  stringtoshow.length; i++) {
            this.translate(1, 0, 0);
            this.getLetter(stringtoshow[i]);
            this.plane.display();
        }

        this.translate(-stringtoshow.length, -1, 0);
        this.clock=count.toString();
        console.log(this.clock);
        for (i = 0; i < this.clock.length; i++) {
            this.translate(1, 0, 0);
            this.getLetter(this.clock[i]);
            this.plane.display();
        }

        this.translate(-this.clock.length, -2, 0);



        for (i = 0; i < 10; i++) {
            this.translate(1, 0, 0);
            this.getLetter(this.msgtoplayer[i]);
            this.plane.display();
        }

        this.translate(-10, -1, 0);

        for (i = 10; i < this.msgtoplayer.length; i++) {
            this.translate(1, 0, 0);
            this.getLetter(this.msgtoplayer[i]);
            this.plane.display();
        }

        this.popMatrix();

        this.setActiveShaderSimple(this.defaultShader);

        //this.camera.setPosition(vec3.fromValues(0,5,20));
        //this.camera.setTarget(vec3.fromValues(0,0,0));




        // ---- END Background, camera and axis setup

        // it is important that things depending on the proper loading of the graph
        // only get executed after the graph has loaded correctly.
        // This is one possible way to do it




        for (var i = 0; i < this.lightsScene.length; i++) {
            this.lightsScene[i]['light'].update();
        }

        if (this.reference != 0) {
            this.axis.display();
        }


        this.DisplayNode(this.root_node[this.ambiente], this.root_node[this.ambiente].material, this.root_node[this.ambiente].texture, this.root_node[this.ambiente].matrix);


        for (var i = 0; i < this.gameState.Pieces.length; i++) {

            //Por as pecas pretas seleccionaveis
            if (this.gameState.state == 0 && this.gameState.playersTurn == 1 && this.gameState.Pieces[i].id == "b" &&
			this.gameState.Pieces[i].inGame && this.gameState.winner == 0 && (this.gameState.gametype == "HvsH" || this.gameState.gametype == "HvsM")) {
                this.registerForPick(pickingindex, this.gameState.Pieces[i]);
                pickingindex++;

                this.pushMatrix();
                this.translate(this.gameState.Pieces[i].posX-11, this.gameState.Pieces[i].posY, this.gameState.Pieces[i].posZ-11);
                this.gameState.Pieces[i].display();
                this.popMatrix();

                this.clearPickRegistration();
            }

            else if (this.gameState.state == 0 && this.gameState.playersTurn == 2 && (this.gameState.Pieces[i].id == "w" || this.gameState.Pieces[i].id == "k" ) &&
			this.gameState.Pieces[i].inGame && this.gameState.winner == 0 && this.gameState.gametype == "HvsH" ) {
                this.registerForPick(pickingindex, this.gameState.Pieces[i]);
                pickingindex++;

                this.pushMatrix();
                this.translate(this.gameState.Pieces[i].posX-11, this.gameState.Pieces[i].posY, this.gameState.Pieces[i].posZ-11);
                this.gameState.Pieces[i].display();
                this.popMatrix();

                this.clearPickRegistration();
            }

            else {
                this.pushMatrix();
                this.translate(this.gameState.Pieces[i].posX-11, this.gameState.Pieces[i].posY, this.gameState.Pieces[i].posZ-11);
                this.gameState.Pieces[i].display();
                this.popMatrix();
            }
        }

    }
    ;

};

Scene.prototype.DisplayNode = function (node, material, texture, matrix) {

    var actualMaterial = node.material;
    if (actualMaterial == "null") {
        actualMaterial = material;
    }
    var actualTexture = node.texture;
    if (actualTexture == "null") {
        actualTexture = texture;
    }
    else if (actualTexture == "clear") {
        actualTexture = "null";
    }

    var actualMatrix = mat4.create();
    mat4.identity(actualMatrix);

    if (node.animations.length != 0) {
        var animation = node.animationsObj[node.currentAnimation - 1];

        mat4.translate(actualMatrix, actualMatrix, [animation.lastAnimation['x'], animation.lastAnimation['y'], animation.lastAnimation['z']]);
        mat4.rotate(actualMatrix, actualMatrix, animation.lastRotation, [0, 1, 0]);
    }

    mat4.multiply(actualMatrix, node.matrix, actualMatrix);
    mat4.multiply(actualMatrix, matrix, actualMatrix);


    for (var descendantIndex in node.descendants) {
        var nextNode = this.nodes[this.ambiente][node.descendants[descendantIndex]];

        //Verificar se e' folha
        if (nextNode == undefined) {
            var leaf = this.leaves[this.ambiente][node.descendants[descendantIndex]];

            if (leaf != undefined) {

                var materialDisplay = this.materials[this.ambiente][actualMaterial];
                var textureDisplay = this.textures[this.ambiente][actualTexture];

                if (textureDisplay != undefined) {
                    leaf.updateTexCoords(textureDisplay.amplif_factorS, textureDisplay.amplif_factorT);
                }

                this.pushMatrix();

                if (textureDisplay != undefined) {
                    if (materialDisplay != undefined) {
                        materialDisplay.appearance.setTexture(textureDisplay.textureCGF);
                        //console.log("Node id: " + node.id + " ; Texture : " + actualTexture);
                    }
                }

                if (materialDisplay != undefined) {
                    materialDisplay.appearance.apply();
                    materialDisplay.appearance.setTexture(null);
                }

                else {
                    if (textureDisplay != undefined) {
                        this.defaultAppearance.setTexture(textureDisplay.textureCGF);
                    }
                    this.defaultAppearance.apply();
                }

                this.multMatrix(actualMatrix);

                if (node.pickingtable == true && this.gameState.state == 1 && !this.gameState.animating) {
                    if (this.pickMode == true) {
                        this.registerForPick(pickingindex, leaf);
                        pickingindex++;
                        leaf.display();
                        this.clearPickRegistration();
                    }
                }

                else if ((node.pickingtable == true && this.gameState.state == 0) || (node.pickingtable == true && this.gameState.state == 1 && this.gameState.animating)) {
                    //do nothing
                }

                else {
                    leaf.display();
                }

                this.popMatrix();
            }
        }

        else {
            this.DisplayNode(nextNode, actualMaterial, actualTexture, actualMatrix);
        }
    }
};

Scene.prototype.logPicking = function () {
    if (this.pickMode == false) {
        if (this.pickResults != null && this.pickResults.length > 0) {
            for (var i = 0; i < this.pickResults.length; i++) {
                var obj = this.pickResults[i][0];

                if ((this.pickResults[i][0] instanceof Piece) || (this.pickResults[i][0] instanceof KingPiece)) {
                    var customId = this.pickResults[i][1];
                    console.log("CUSTOM ID" + customId);

                    this.gameState.selectedPieceArrayPos = customId;

                    var actualX = Math.abs((this.pickResults[i][0].posX) / 2) + 0.5;
                    var actualZ = Math.abs((this.pickResults[i][0].posZ) / 2) + 0.5;

                    console.log("Picked object: " + this.pickResults[i][0] + ", with x " + actualX + " and z " + actualZ);
                    this.gameState.selectedPiece = this.pickResults[i][0];
                    this.gameState.state++;
                }

                else if (obj) {
                    var customId = this.pickResults[i][1];

                    var actualX = Math.abs((this.gameState.selectedPiece.posX) / 2) + 0.5;
                    var actualZ = Math.abs((this.gameState.selectedPiece.posZ) / 2) + 0.5;

                    var newZ = this.getCoordPicking(customId)[0];
                    var newX = this.getCoordPicking(customId)[1];

                    this.msgtoplayer="Picked object: " + obj + ", with x " + newX + " and z " + newZ;
                    console.log(this.msgtoplayer);

                    var idPiece = this.gameState.selectedPiece.id.charAt(0);

                    //CHAMAR A FUNCAO DO PROLOG AQUI
                    moveRequest(this.gameState.playersTurn, actualX, actualZ, newX, newZ, boardFromProlog, idPiece, this.gameState.gametype);
					          this.cameraanimation= new CameraAnimation(this,2,180);


                    this.gameState.selectedPieceNewX = (newX * 2) - 1;
                    this.gameState.selectedPieceNewZ = (newZ * 2) - 1;


                    var newMatrixPos = [];
                    newMatrixPos.x = newX - 1;
                    newMatrixPos.z = newZ - 1;

                    this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].matrixPos = newMatrixPos;
                    this.gameState.undo = false;
                }
            }
            this.pickResults.splice(0, this.pickResults.length);
        }
    }
};

Scene.prototype.getCoordPicking = function (valuePicking) {
    var coordx;
    var coordy;
    var coords = [];

    if (valuePicking < 12) {
        coordx = valuePicking;
        coordy = 1;
    }
    else if (valuePicking > 11 && valuePicking < 23) {
        coordx = valuePicking - 11;
        coordy = 2;
    }
    else if (valuePicking > 22 && valuePicking < 34) {
        coordx = valuePicking - 22;
        coordy = 3;
    }
    else if (valuePicking > 33 && valuePicking < 45) {
        coordx = valuePicking - 33;
        coordy = 4;
    }
    else if (valuePicking > 44 && valuePicking < 56) {
        coordx = valuePicking - 44;
        coordy = 5;
    }
    else if (valuePicking > 55 && valuePicking < 67) {
        coordx = valuePicking - 55;
        coordy = 6;
    }
    else if (valuePicking > 66 && valuePicking < 78) {
        coordx = valuePicking - 66;
        coordy = 7;
    }
    else if (valuePicking > 77 && valuePicking < 89) {
        coordx = valuePicking - 77;
        coordy = 8;
    }
    else if (valuePicking > 88 && valuePicking < 100) {
        coordx = valuePicking - 88;
        coordy = 9;
    }
    else if (valuePicking > 99 && valuePicking < 111) {
        coordx = valuePicking - 99;
        coordy = 10;
    }
    else if (valuePicking > 110 && valuePicking < 122) {
        coordx = valuePicking - 110;
        coordy = 11;
    }

    coords.push(coordx);
    coords.push(coordy);
    return coords;
};

Scene.prototype.findPiece = function (id, matrixPosZ, matrixPosX) {
    for (var i = 0; i < this.gameState.Pieces.length; i++) {
        if (this.gameState.Pieces[i].inGame) {
            if ((this.gameState.Pieces[i].matrixPos.x == matrixPosX) && (this.gameState.Pieces[i].matrixPos.z == matrixPosZ)) {

                var controlPointsAux = [];

                var controlPoint = [];
                controlPoint["x"] = this.gameState.Pieces[i].posX;
                controlPoint["y"] = 0;
                controlPoint["z"] = this.gameState.Pieces[i].posZ;
                controlPointsAux.push(controlPoint);

                controlPoint = [];
                if(this.gameState.piecesOut.length>11){
                  controlPoint["x"] = 27;
                  controlPoint["z"] = (this.gameState.piecesOut.length-12) * 2;
                }
                else {
                  controlPoint["x"] = 25;
                  controlPoint["z"] = this.gameState.piecesOut.length * 2;
                }
                controlPoint["y"] = 0;


                controlPointsAux.push(controlPoint);

                this.gameState.Pieces[i].animation = new PieceAnimation(this, 2, controlPointsAux);
                this.gameState.piecesAnimatingOut.push(this.gameState.Pieces[i].arrayPos);
                this.gameState.piecesOut.push(this.gameState.Pieces[i].arrayPos);

                if (id == "k") {
                    this.gameState.winner = 1;
                    console.log("JOGADOR 1 GANHOU O JOGO");
                }

            }
        }
    }
}

Scene.prototype.getBoard = function () {
    var newboard = eval(boardFromProlog);

    if (this.gameState.boardsFromProlog.length == 0)
  		this.gameState.boardsFromProlog.push(boardFromProlog);

    //Alterar tabuleiro atual e acrescentar a lista de tabuleiros
    if (!this.gameState.board.equals(newboard)) {

        var oldCol = Math.abs((this.gameState.selectedPiece.posX) / 2) + 0.5;
        var oldRow = Math.abs((this.gameState.selectedPiece.posZ) / 2) + 0.5;

        var newCol = (this.gameState.selectedPieceNewX / 2) + 0.5;
        var newRow = (this.gameState.selectedPieceNewZ / 2) + 0.5;

        //Verificacao horizontal
        if (Math.abs(this.gameState.selectedPiece.posX - this.gameState.selectedPieceNewX) > 0) {

            for (x = 0; x < this.gameState.board[newRow - 1].length; x++) {
                if ((this.gameState.board[newRow - 1][x] != newboard[newRow - 1][x]) && (x != oldCol - 1) && (x != newCol - 1)) {
                    //console.log("Peca " + this.gameState.board[newRow-1][x] + " foi-se.");

                    this.findPiece(this.gameState.board[newRow - 1][x], newRow - 1, x);
                }

            }

            //cima
            if (newRow > 1 && newRow != 11) {
                for (x = 0; x < this.gameState.board[newRow - 2].length; x++) {
                    if (this.gameState.board[newRow - 2][x] != newboard[newRow - 2][x]) {
                        //console.log("Peca " + this.gameState.board[newRow-2][x] + " foi-se.");

                        this.findPiece(this.gameState.board[newRow - 2][x], newRow - 2, x);
                    }

                }
            }

            //baixo
            if (newRow < 11 && newRow != 1) {
                for (x = 0; x < this.gameState.board[newRow].length; x++) {
                    if (this.gameState.board[newRow][x] != newboard[newRow][x]) {
                        //console.log("Peca " + this.gameState.board[newRow][x] + " foi-se.");

                        this.findPiece(this.gameState.board[newRow][x], newRow, x);
                    }

                }
            }
        }

        //Verificacao vertical
        else {
            for (z = 0; z < this.gameState.board.length; z++) {

                if ((this.gameState.board[z][oldCol - 1] != newboard[z][oldCol - 1]) && (z != oldRow - 1) && (z != newRow - 1)) {
                    //console.log("Peca " + this.gameState.board[z][oldCol-1] + " foi-se.");

                    this.findPiece(this.gameState.board[z][oldCol - 1], z, oldCol - 1);
                }

                //direita
                if (newCol > 1 && newCol != 11) {
                    if (this.gameState.board[z][oldCol] != newboard[z][oldCol]) {
                        //console.log("Peca " + this.gameState.board[z][oldCol] + " foi-se.");

                        this.findPiece(this.gameState.board[z][oldCol - 1], z, oldCol);
                    }
                }

                //esquerda
                if (newCol < 11 && newCol != 1) {
                    if (this.gameState.board[z][oldCol - 2] != newboard[z][oldCol - 2]) {
                        //console.log("Peca " + this.gameState.board[z][oldCol-2] + " foi-se.");

                        this.findPiece(this.gameState.board[z][oldCol - 1], z, oldCol - 2);
                    }
                }

            }
        }

        this.gameState.board = newboard;
        this.gameState.boards.push(this.gameState.board);
        this.gameState.boardsFromProlog.push(boardFromProlog);

        //Animacao de movimento da peca
        this.gameState.animating = true;

        var controlPointsAux = [];

        var controlPoint = [];
        controlPoint["x"] = this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].posX;
        controlPoint["y"] = 0;
        controlPoint["z"] = this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].posZ;
        controlPointsAux.push(controlPoint);

        controlPoint = [];
        controlPoint["x"] = this.gameState.selectedPieceNewX;
        controlPoint["y"] = 0;
        controlPoint["z"] = this.gameState.selectedPieceNewZ;
        controlPointsAux.push(controlPoint);

        this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].animation = new PieceAnimation(this, 2, controlPointsAux);

        if ((this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].id == "k") &&
            ((this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].matrixPos.x == 0) ||
            (this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].matrixPos.x == 10) ||
            (this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].matrixPos.z == 0) ||
            (this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].matrixPos.z == 10))) {
            this.gameState.winner = 2;
            console.log("JOGADOR 2 GANHOU O JOGO");
        }

        if (this.gameState.gametype == "MvsM") {
          moveRequest(this.gameState.playersTurn, 0, 0, 0, 0, boardFromProlog, 0, this.gameState.gametype);
          this.cameraanimation= new CameraAnimation(this,2,180);

          /*if(this.gameState.state == 0)
            this.gameState.state++;

          else
            this.gameState.state = 0;*/

          /*this.gameState.selectedPieceNewX = (newX * 2) - 1;
          this.gameState.selectedPieceNewZ = (newZ * 2) - 1;


          var newMatrixPos = [];
          newMatrixPos.x = newX - 1;
          newMatrixPos.z = newZ - 1;

          this.gameState.Pieces[this.gameState.selectedPiece.arrayPos].matrixPos = newMatrixPos;*/
        }
    }
};

Scene.prototype.initLevels = function () {
    this.levels = ["Easy", "Medium", "Hard"];
};

Scene.prototype.changelevel = function (level) {

};

Scene.prototype.inittypes = function () {
    this.gametypes = ["HvsH", "HvsM", "MvsM"];
};
Scene.prototype.changetype = function (type) {

};



Scene.prototype.getLetter = function (letter) {
    var i = 0;
    var j = 0;
    var n = letter.charCodeAt(0);
    if (n >= 32 && n <= 47) {
        j = 2;
        i = n - 32;
    }
    else if (n >= 48 && n <= 63) {
        j = 3;
        i = n - 48;
    }
    else if (n >= 64 && n <= 79) {
        j = 4;
        i = n - 64;
    }
    else if (n >= 80 && n <= 95) {
        j = 5;
        i = n - 80;
    }
    else if (n >= 96 && n <= 111) {
        j = 6;
        i = n - 96;
    }
    else if (n >= 112 && n <= 127) {
        j = 7;
        i = n - 112;
    }

    this.activeShader.setUniformsValues({'charCoords': [i, j]});
};

Scene.prototype.timer= function (){
  count=count-1;
  console.log(count);
  if (count <= 0)
  {
     clearInterval(counter);

     this.changeTurn();

     return;
  }

  //Do code for showing the number of seconds here
};

Scene.prototype.changeTurn= function (){

  //Animacao de movimento da peca
  this.changeplayer = true;
  if (this.gameState.playersTurn == 2)
      this.gameState.playersTurn = 1;

  else
      this.gameState.playersTurn = 2;

  this.cameraanimation= new CameraAnimation(this,2,180);

  this.gameState.state = 0;
};




Scene.prototype.movieofgame= function (){
  for(i=0;i<this.gameState.boards.length;i++){
    console.log("Mas faz?");
    this.gameState.board=this.gameState.boards[i];
      this.initGame();
  }
};
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
