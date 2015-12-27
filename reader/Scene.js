function Scene() {
  CGFscene.call(this);
  this.graph=[];
}
var pickingindex;

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

  this.graphRootId=[];
  this.nodeGraph = [];
  this.root_node=[];

  this.camera.near;
  this.camera.far;
  this.matrixInit;
  this.reference;


  this.leaves=[];
  this.materials=[];
  this.textures=[];
  this.nodes=[];
  this.animations=[];

  this.lastTimeUpdate = 0;

  this.defaultAppearance = new CGFappearance(this);
  this.defaultAppearance.setAmbient(0.2, 0.4, 0.8, 1.0);
  this.defaultAppearance.setDiffuse(0.2, 0.4, 0.8, 1.0);
  this.defaultAppearance.setSpecular(0.2, 0.4, 0.8, 1.0);
  this.defaultAppearance.setShininess(10.0);

  this.animating = true;

  this.setUpdatePeriod(20);

  this.initLevels();

  this.inittypes();

  initRequest();

  this.gameState = new GameState();

  this.ambiente="Quarto";

  this.ambientes=["Quarto","Piquenique"];

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
    if(node.animations.length != 0) {

      for (var i = 0; i < node.animations.length; i++) {
        node.animationsObj[i].reset();
      }
      this.nodes[NodeIndex].currentAnimation = 1;
    }
  }
};

Scene.prototype.update = function(time) {
  if (this.animating) {
    var diff = (time - this.lastTimeUpdate) / 1000;

    this.lastTimeUpdate = time;

    for (var NodeIndex in this.nodes[this.ambiente]) {
      var node = this.nodes[this.ambiente][NodeIndex];
      if(node.animations.length != 0) {

        if(!node.animationsObj[node.currentAnimation-1].done) {
          node.animationsObj[node.currentAnimation-1].animate(diff);
        }

        else {
          if (node.currentAnimation < node.animations.length) {
            this.nodes[this.ambiente][NodeIndex].currentAnimation++;
          }
        }
      }
    }
  }

  else {
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

    if(this.graph[this.ambiente].lights[i]["enable"]) {
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
  this.camera = new CGFcamera(0.6, 0.1, 500, vec3.fromValues(0,5,20), vec3.fromValues(0, 0, 0));

};


// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
Scene.prototype.onGraphLoaded = function ()
{

  if(this.graph[this.ambiente].reference != 0) { this.axis = new CGFaxis(this, this.graph[this.ambiente].reference); }

  this.gl.clearColor(this.graph[this.ambiente].background["r"],this.graph[this.ambiente].background["g"],this.graph[this.ambiente].background["b"],this.graph[this.ambiente].background["a"]);
  this.setGlobalAmbientLight(this.graph[this.ambiente].ambient["r"], this.graph[this.ambiente].ambient["g"], this.graph[this.ambiente].ambient["b"], this.graph[this.ambiente].ambient["a"]);

  this.initLights();

  this.camera.near = this.graph[this.ambiente].frustum['near'];
  this.camera.far = this.graph[this.ambiente].frustum['far'];

  this.matrixInit = this.graph[this.ambiente].matrixInit;
  this.reference = this.graph[this.ambiente].reference;

  for(i=0;i<this.ambientes.length;i++)
  {
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
      if(this.nodes[this.ambientes[i]][NodeIndex].animations.length != 0) {
        for (var animationIndex in this.nodes[this.ambientes[i]][NodeIndex].animations) {

          var animation = this.animations[this.nodes[this.ambientes[i]][NodeIndex].animations[animationIndex]];
          this.nodes[this.ambientes[i]][NodeIndex].animationsObj.push(animation);
        }

        this.nodes[this.ambientes[i]][NodeIndex].currentAnimation = 1;
      }
    }
  }




  /*
  INICIAR TABULEIRO DE JOGO E PECAS
  */
  var z = 0, x = 0;
  var player;

  for (z = 0; z < this.gameState.board.length; z++) {

    for (x = 0; x < this.gameState.board[z].length; x++) {

      var actualNode;

      switch (this.gameState.board[z][x]) {
        case "b":
        actualNode = this.nodes[this.ambiente]["black_P"];
        player = 2;

        var materialDisplay = this.materials[this.ambiente][actualNode.material].appearance;
        var textureDisplay = this.textures[this.ambiente][actualNode.texture].textureCGF;
        this.gameState.Pieces.push(new Piece(this, this.gameState.board[z][x], player, -11 +(x*2)+1, -11 +(z*2)+1, true, materialDisplay, textureDisplay));
        break;

        case "w":
        actualNode = this.nodes[this.ambiente]["white_P"];
        player = 1;

        var materialDisplay = this.materials[this.ambiente][actualNode.material].appearance;
        var textureDisplay = this.textures[this.ambiente][actualNode.texture].textureCGF;
        this.gameState.Pieces.push(new Piece(this, this.gameState.board[z][x], player, -11 +(x*2)+1, -11 +(z*2)+1, true, materialDisplay, textureDisplay));
        break;

        case "k":
        actualNode = this.nodes[this.ambiente]["king"];
        player = 1;

        var materialDisplay = this.materials[this.ambiente][actualNode.material].appearance;
        var textureDisplay = this.textures[this.ambiente][actualNode.texture].textureCGF;
        var texture2Display = this.textures[this.ambiente]["gold"].textureCGF;

        this.gameState.Pieces.push(new KingPiece(this, this.gameState.board[z][x], player, -11 +(x*2)+1,-11 + (z*2)+1, true, materialDisplay, textureDisplay, texture2Display));
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
  //Board from Prolog
  if(boardFromProlog.length>0)
  {
    this.getBoard();
  }

  // Picking

  this.logPicking();
  this.clearPickRegistration();
  pickingindex=1;

  // ---- BEGIN Background, camera and axis setup

  // Clear image and depth buffer everytime we update the scene
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  this.gl.enable(this.gl.DEPTH_TEST);

  // Initialize Model-View matrix as identity (no transformation
  this.updateProjectionMatrix();
  this.loadIdentity();

  //this.camera.setPosition(vec3.fromValues(0,5,20));
	//this.camera.setTarget(vec3.fromValues(0,0,0));

  // Apply transformations corresponding to the camera position relative to the origin
 this.applyViewMatrix();

  // ---- END Background, camera and axis setup

  // it is important that things depending on the proper loading of the graph
  // only get executed after the graph has loaded correctly.
  // This is one possible way to do it
  if (this.graph[this.ambiente].loadedOk)
  {

    this.multMatrix(this.matrixInit);

    for (var i = 0; i < this.lightsScene.length; i++) {
      this.lightsScene[i]['light'].update();
    }

    if(this.reference != 0) { this.axis.display(); }


    this.DisplayNode(this.root_node[this.ambiente], this.root_node[this.ambiente].material, this.root_node[this.ambiente].texture, this.root_node[this.ambiente].matrix);



    for (var i = 0; i < this.gameState.Pieces.length; i++) {
      /*var matrix = mat4.create();
      mat4.identity(matrix);
      mat4.translate(matrix, matrix, [this.gameState.Pieces.posX, 0, this.gameState.Pieces.posZ]);*/

	  //Por as pecas pretas seleccionaveis
//console.log(this.gameState.state);
	  if(this.gameState.state == 0 && this.gameState.playersTurn == 1 && this.gameState.Pieces[i].id == "b") {
		//console.log(this.gameState.Pieces[i].posX);
		//var actualX = this.gameState.Pieces[i].posX + 5;
		//console.log(actualX);
		//console.log(this.gameState.Pieces[i].posZ);
		//var actualZ = this.gameState.Pieces[i].posZ + 5;
		//console.log(actualZ);

		//var idPos = parseInt(actualX + "" + actualZ);
		//console.log(idPos);

		this.registerForPick(pickingindex, this.gameState.Pieces[i]);
		pickingindex++;

		this.pushMatrix();
		this.translate(this.gameState.Pieces[i].posX, 0, this.gameState.Pieces[i].posZ);
		this.gameState.Pieces[i].display();
		this.popMatrix();

		this.clearPickRegistration();
	  }
	  
	  else if(this.gameState.state == 0 && this.gameState.playersTurn == 2 && (this.gameState.Pieces[i].id == "w" || this.gameState.Pieces[i].id == "k" )) {
		//var actualX = this.gameState.Pieces[i].posX + 5;
		//var actualZ = this.gameState.Pieces[i].posZ + 5;

		//var idPos = parseInt(actualX + "" + actualZ);
		this.registerForPick(pickingindex, this.gameState.Pieces[i]);
		pickingindex++;

		this.pushMatrix();
		this.translate(this.gameState.Pieces[i].posX, 0, this.gameState.Pieces[i].posZ);
		this.gameState.Pieces[i].display();
		this.popMatrix();

	   this.clearPickRegistration();
	  }

      else {
		  this.pushMatrix();
		  this.translate(this.gameState.Pieces[i].posX, 0, this.gameState.Pieces[i].posZ);
		  this.gameState.Pieces[i].display();
		  this.popMatrix();
	  }
    }

  };

};

Scene.prototype.DisplayNode = function (node, material, texture, matrix) {

  var actualMaterial = node.material;
  if (actualMaterial == "null") { actualMaterial = material; }

  //console.log("Node ID: " + node.id);
  var actualTexture = node.texture;
  //console.log("Node Texture: " + actualTexture);
  if (actualTexture == "null") { actualTexture = texture; }
  else if (actualTexture == "clear") { actualTexture = "null"; }
  //console.log("ActualTexture: " + actualTexture);

  var actualMatrix = mat4.create();
  mat4.identity(actualMatrix);

  if(node.animations.length != 0) {
    var animation = node.animationsObj[node.currentAnimation-1];

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

      //console.log("pickin id: "+node.pickingid);
      if (leaf != undefined) {

        var materialDisplay = this.materials[this.ambiente][actualMaterial];
        var textureDisplay = this.textures[this.ambiente][actualTexture];

        if (textureDisplay != undefined) {
          leaf.updateTexCoords(textureDisplay.amplif_factorS, textureDisplay.amplif_factorT);
        }

        this.pushMatrix();

        if (textureDisplay != undefined) {
          if(materialDisplay != undefined){
            materialDisplay.appearance.setTexture(textureDisplay.textureCGF);
            //console.log("Node id: " + node.id + " ; Texture : " + actualTexture);
          }
        }

        if(materialDisplay != undefined){
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


        //if(node.pickingtable != true)


        //  else {
        if(node.pickingtable==true && this.gameState.state == 1)
        {
          if(this.pickMode==true)
          {
            //console.log(pickingindex+ "  "+ leaf);
            this.registerForPick(pickingindex, leaf);
            pickingindex++;
            leaf.display();
           this.clearPickRegistration();
          }
        }

		else if(node.pickingtable==true && this.gameState.state == 0) {
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

Scene.prototype.logPicking = function ()
{
  if (this.pickMode == false) {
    if (this.pickResults != null && this.pickResults.length > 0) {
      for (var i=0; i< this.pickResults.length; i++) {
        var obj = this.pickResults[i][0];

        if ((this.pickResults[i][0] instanceof Piece) || (this.pickResults[i][0] instanceof KingPiece))
        {
			var actualX = Math.abs((this.pickResults[i][0].posX+10)/2)+1;
			var actualZ = Math.abs((this.pickResults[i][0].posZ+10)/2)+1;

          console.log("Picked object: " + this.pickResults[i][0] + ", with x " + actualX +" and z " + actualZ);
		  this.gameState.selectedPiece = this.pickResults[i][0];
		  this.gameState.state++;
        }

		else if (obj) {
			var customId = this.pickResults[i][1];
			//console.log("CUSTOM ID" + customId);

			var actualX = Math.abs((this.gameState.selectedPiece.posX+10)/2)+1;
			var actualZ = Math.abs((this.gameState.selectedPiece.posZ+10)/2)+1;

			var newZ = this.getCoordPicking(customId)[0];
			var newX = this.getCoordPicking(customId)[1];

			console.log("Picked object: " + obj + ", with x " + newX + " and z " + newZ);

			var idPiece = this.gameState.selectedPiece.id.charAt(0);

			//CHAMAR A FUNCAO DO PROLOG AQUI
			moveRequest(this.gameState.playersTurn, actualX, actualZ, newX, newZ, boardFromProlog, idPiece);
		}
      }
      this.pickResults.splice(0,this.pickResults.length);
    }
  }
};

Scene.prototype.getCoordPicking = function (valuePicking) {
  var coordx;
  var coordy;
  var coords = [];

  if(valuePicking<12)
  {
	coordx=valuePicking;
	coordy=1;
  }
  else if(valuePicking>11 && valuePicking<23)
  {
	coordx=valuePicking-11;
	coordy=2;
  }
  else if(valuePicking>22 && valuePicking<34)
  {
	coordx=valuePicking-22;
	coordy=3;
  }
  else if(valuePicking>33 && valuePicking<45)
  {
	coordx=valuePicking-33;
	coordy=4;
  }
  else if(valuePicking>44 && valuePicking<56)
  {
	coordx=valuePicking-44;
	coordy=5;
  }
  else if(valuePicking>55 && valuePicking<67)
  {
	coordx=valuePicking-55;
	coordy=6;
  }
  else if(valuePicking>66 && valuePicking<78)
  {
	coordx=valuePicking-66;
	coordy=7;
  }
  else if(valuePicking>77 && valuePicking<89)
  {
	coordx=valuePicking-77;
	coordy=8;
  }
  else if(valuePicking>88 && valuePicking<100)
  {
	coordx=valuePicking-88;
	coordy=9;
  }
  else if(valuePicking>99 && valuePicking<111)
  {
	coordx=valuePicking-99;
	coordy=10;
  }
  else if(valuePicking>110 && valuePicking<122)
  {
	coordx=valuePicking-110;
	coordy=11;
  }

  coords.push(coordx);
  coords.push(coordy);
  return coords;
};

Scene.prototype.getBoard = function ()
{
  var newboard = eval(boardFromProlog);

  if(!this.gameState.board.equals(newboard)) {
    //console.log(newboard);
    this.gameState.board = newboard;
	console.log("MUDOU  TABULEIRO");
	
	if(this.gameState.playersTurn == 1)
				this.gameState.playersTurn = 2;
			
	else
		this.gameState.playersTurn = 1;
				
	this.gameState.state = 0;
  }
};

Scene.prototype.initLevels= function ()
{
  this.levels= ["Easy", "Medium", "Hard"];
};

Scene.prototype.changelevel = function (level)
{

};

Scene.prototype.inittypes = function ()
{
  this.gametypes= ["HvsH", "HvsM", "MvsM"];
};
Scene.prototype.changetype = function (type)
{

};


Scene.prototype.undo = function ()
{

};

// Warn if overriding existing method
if(Array.prototype.equals)
console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
  return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
  return false;

  for (var i = 0, l=this.length; i < l; i++) {
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
