function Scene() {
    CGFscene.call(this);
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
  this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);
  this.gl.depthMask(false);
 
    this.enableTextures(true);
 
    this.graphRootId;
    this.nodeGraph = [];
    var root_node;
 
    this.camera.near;
    this.camera.far;
    this.matrixInit;
    this.reference;
 
    this.leaves;
    this.materials;
    this.textures;
    this.nodes;
    this.animations;
 
    this.lastTimeUpdate = 0;
 
    this.defaultAppearance = new CGFappearance(this);
    this.defaultAppearance.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.defaultAppearance.setShininess(10.0);
 
    this.animating = true;
 
    this.setUpdatePeriod(20);
 
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
 
        for (var NodeIndex in this.nodes) {
            var node = this.nodes[NodeIndex];
                if(node.animations.length != 0) {
 
                    if(!node.animationsObj[node.currentAnimation-1].done) {
                        node.animationsObj[node.currentAnimation-1].animate(diff);
                    }
 
                    else {
                        if (node.currentAnimation < node.animations.length) {
                            this.nodes[NodeIndex].currentAnimation++;
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
 
     for (var i = 0; i < this.graph.lights.length; i++) {
        var light = new CGFlight(this, i);
 
        light.setPosition(this.graph.lights[i]["position"]["x"], this.graph.lights[i]["position"]["y"], this.graph.lights[i]["position"]["z"], this.graph.lights[i]["position"]["w"]);
        light.setAmbient(this.graph.lights[i]["ambient"]["r"], this.graph.lights[i]["ambient"]["g"], this.graph.lights[i]["ambient"]["b"], this.graph.lights[i]["ambient"]["a"]);
        light.setDiffuse(this.graph.lights[i]["diffuse"]["r"], this.graph.lights[i]["diffuse"]["g"], this.graph.lights[i]["diffuse"]["b"], this.graph.lights[i]["diffuse"]["a"]);
        light.setSpecular(this.graph.lights[i]["specular"]["r"], this.graph.lights[i]["specular"]["g"], this.graph.lights[i]["specular"]["b"], this.graph.lights[i]["specular"]["a"]);
 
        this.lightsScene[i] = [];
        this.lightsScene[i]['enabled'] = false;
 
        if(this.graph.lights[i]["enable"]) {
            light.enable();
            this.lightsScene[i]['enabled'] = true;
        }
        else {
            light.disable();
        }
        light.setVisible(false);
        light.update();
        this.lightsScene[i]['light'] = light;
        this.lightsScene[i]['id'] = this.graph.lights[i]["id"];
 
    }
 
    //Add the lights to interface
    this.interface.addLights();
};
 
Scene.prototype.initCameras = function () {
//( fov, near, far, position, target )
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));
};
 
// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
Scene.prototype.onGraphLoaded = function ()
{
    if(this.graph.reference != 0) { this.axis = new CGFaxis(this, this.graph.reference); }
 
    this.gl.clearColor(this.graph.background["r"],this.graph.background["g"],this.graph.background["b"],this.graph.background["a"]);
    this.setGlobalAmbientLight(this.graph.ambient["r"], this.graph.ambient["g"], this.graph.ambient["b"], this.graph.ambient["a"]);
 
    this.initLights();
 
    this.camera.near = this.graph.frustum['near'];
    this.camera.far = this.graph.frustum['far'];
 
    this.matrixInit = this.graph.matrixInit;
    this.reference = this.graph.reference;
 
    this.nodes = this.graph.nodes;
 
    this.graphRootId = this.graph.root;
    root_node = this.nodes[this.graphRootId];
 
    this.leaves = this.graph.leaves;
    this.materials = this.graph.materials;
    this.textures = this.graph.textures;
    this.animations = this.graph.animations;
 
    for (var NodeIndex in this.nodes) {
        if(this.nodes[NodeIndex].animations.length != 0) {
            for (var animationIndex in this.nodes[NodeIndex].animations) {
 
                var animation = this.animations[this.nodes[NodeIndex].animations[animationIndex]];
                this.nodes[NodeIndex].animationsObj.push(animation);
            }
 
            this.nodes[NodeIndex].currentAnimation = 1;
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
  // Picking
  this.logPicking();
    this.clearPickRegistration();
 pickingindex=1;
 
    // ---- BEGIN Background, camera and axis setup
 
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
 
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
 
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();
 
    // ---- END Background, camera and axis setup
 
    // it is important that things depending on the proper loading of the graph
    // only get executed after the graph has loaded correctly.
    // This is one possible way to do it
    if (this.graph.loadedOk)
    {
 
        this.multMatrix(this.matrixInit);
 
        for (var i = 0; i < this.lightsScene.length; i++) {
            this.lightsScene[i]['light'].update();
        }
 
        if(this.reference != 0) { this.axis.display(); }
 
        this.DisplayNode(root_node, root_node.material, root_node.texture, root_node.matrix);
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
        var nextNode = this.nodes[node.descendants[descendantIndex]];
 
        //Verificar se e' folha
        if (nextNode == undefined) {
            var leaf = this.leaves[node.descendants[descendantIndex]];
 
            //console.log("pickin id: "+node.pickingid);
            if (leaf != undefined) {
 
                var materialDisplay = this.materials[actualMaterial];
                var textureDisplay = this.textures[actualTexture];
 
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
        if(node.pickingtable==true)
        {
          if(this.pickMode==true)
          {
            this.registerForPick(pickingindex, leaf);
            pickingindex++;
            leaf.display();
            this.clearPickRegistration();
          }
        }
        else {
          leaf.display();
        }
 
 
        //  }
 
 
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
                if (obj)
                {
                    var customId = this.pickResults[i][1];
                    console.log("Picked object: " + obj + ", with x " + this.getCoordPicking(customId)[0]+" and y "+this.getCoordPicking(customId)[1]);
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