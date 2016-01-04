function Parser(filename, scene, graphname) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph
    this.scene = scene;
    scene.graph[graphname] = this;

    // File reading
    this.reader = new CGFXMLreader();

    /*
     * Read the contents of the xml file, and refer to this class for loading and error handlers.
     * After the file is read, the reader calls onXMLReady on this object.
     * If any error occurs, the reader calls onXMLError on this object, with an error message
     */

    this.reader.open('scenes/' + filename, this);
    console.log("Parsing " + filename + " ...");

    this.frustum = [];
    this.translate = [];
    this.rotation = [[], [], []];
    this.scale = [];
    this.matrixInit;

    this.ambient = [];
    this.background = [];

    this.lights = [];

    this.textures = [];
    this.materials = [];
    this.animations = [];

    this.root;
    this.leaves = [];
    this.nodes = [];
}

/*
 * Callback to be executed after successful reading
 */
Parser.prototype.onXMLReady = function () {
    console.log("\nXML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseLSX(rootElement);

    if (error != null) {
        this.onXMLError(error);
        return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
};

Parser.prototype.parseLSX = function (rootElement) {
    var error;

    if (error = (this.Initials(rootElement) != null)) {
        return error;
    }

    if (error = (this.Ilumination(rootElement) != null)) {
        return error;
    }

    if (error = (this.Lights(rootElement) != null)) {
        return error;
    }

    if (error = (this.Textures(rootElement) != null)) {
        return error;
    }

    if (error = (this.Materials(rootElement) != null)) {
        return error;
    }

    if (error = (this.Leaves(rootElement) != null)) {
        return error;
    }

    if (error = (this.Animations(rootElement) != null)) {
        return error;
    }

    if (error = (this.Nodes(rootElement) != null)) {
        return error;
    }

    console.log("\n---Parser done---");
};

Parser.prototype.Initials = function (rootElement) {
    console.log("\n---Initials init---");

    var initials = rootElement.getElementsByTagName('INITIALS')[0];
    if (initials == null) {
        return "\nInitials element is missing.";
    }

    //---FRUSTUM---//
    var frustum = initials.getElementsByTagName('frustum')[0];
    if (frustum == null) {
        return "\nFrustum element is missing.";
    }

    this.frustum['near'] = this.reader.getFloat(frustum, 'near', true);
    console.log("\nFrustum near: " + this.frustum['near']);
    this.frustum['far'] = this.reader.getFloat(frustum, 'far', true);
    console.log("\nFrustum far: " + this.frustum['far']);

    var matrixAux = mat4.create()
    mat4.identity(matrixAux);

    //---TRANSLATE---//
    var translate = initials.getElementsByTagName('translation')[0];
    if (translate == null) {
        return "\nTranslation element is missing.";
    }

    var translat = [];
    translat.x = this.reader.getFloat(translate, 'x', true);
    console.log("\nTranslation x: " + translat.x);
    translat.y = this.reader.getFloat(translate, 'y', true);
    console.log("\nTranslation y: " + translat.y);
    translat.z = this.reader.getFloat(translate, 'z', true);
    console.log("\nTranslation z: " + translat.z);

    mat4.translate(matrixAux, matrixAux, [translat.x, translat.y, translat.z]);

    //---ROTATION---//
    var elems = initials.getElementsByTagName('rotation');
    if (elems == null) {
        return "\nRotation element is missing.";
    }
    if (elems.length != 3) {
        return "\nInvalid number of Rotation elements";
    }

    for (var i = 0; i < 3; i++) {
        var rotation = elems[i];
        this.rotation[i]['axis'] = this.reader.getString(rotation, 'axis', true);
        var rotAux = this.rotation[i]['axis'];
        if (rotAux != 'x' && rotAux != 'y' && rotAux != 'z') {
            return "\nInvalid axis for Rotation elements";
        }
        console.log("\nRotation " + i + " axis: " + this.rotation[i]['axis']);
        this.rotation[i]['angle'] = this.reader.getFloat(rotation, 'angle', true);
        console.log("\nRotation " + i + " angle: " + this.rotation[i]['angle']);

        mat4.rotate(matrixAux, matrixAux, this.rotation[i]['angle'] * Math.PI / 180, [this.rotation[i]['axis'] == "x" ? 1 : 0, this.rotation[i]['axis'] == "y" ? 1 : 0, this.rotation[i]['axis'] == "z" ? 1 : 0]);

    }

    //---SCALE---//
    var scale = initials.getElementsByTagName('scale')[0];
    if (scale == null) {
        return "\nScale element is missing.";
    }

    var scal = [];
    scal.x = this.reader.getFloat(scale, "sx", true);
    console.log("\nScale sx: " + scal.x);
    scal.y = this.reader.getFloat(scale, "sy", true);
    console.log("\nScale sy: " + scal.y);
    scal.z = this.reader.getFloat(scale, "sz", true);
    console.log("\nScale sz: " + scal.z);

    mat4.scale(matrixAux, matrixAux, [scal.x, scal.y, scal.z]);

    this.matrixInit = matrixAux;

    console.log(this.matrixInit);

    //---REFERENCE---//
    var reference = initials.getElementsByTagName('reference')[0];
    if (reference == null) {
        return "\nReference element is missing.";
    }

    this.reference = this.reader.getFloat(reference, 'length', true);

    console.log("\n---Initials done---");
};

Parser.prototype.Ilumination = function (rootElement) {
    console.log("\n---Ilumination init---");

    var ilumination = rootElement.getElementsByTagName('ILLUMINATION')[0];
    if (ilumination == null) {
        return "\nIlumination element is missing.";
    }

    //---AMBIENT---//
    var ambient = ilumination.getElementsByTagName('ambient')[0];
    if (ambient == null) {
        return "\nAmbient element is missing.";
    }

    this.ambient["r"] = this.reader.getFloat(ambient, "r", true);
    this.ambient["g"] = this.reader.getFloat(ambient, "g", true);
    this.ambient["b"] = this.reader.getFloat(ambient, "b", true);
    this.ambient["a"] = this.reader.getFloat(ambient, "a", true);
    console.log("\nAmbient (RGBA): " + this.ambient["r"] + " " + this.ambient["g"] + " " + this.ambient["b"] + " " + this.ambient["a"]);

    //---BACKGROUND---//
    var background = ilumination.getElementsByTagName('background')[0];
    if (background == null) {
        return "\nBackground element is missing.";
    }

    this.background["r"] = this.reader.getFloat(background, "r", true);
    this.background["g"] = this.reader.getFloat(background, "g", true);
    this.background["b"] = this.reader.getFloat(background, "b", true);
    this.background["a"] = this.reader.getFloat(background, "a", true);
    console.log("\nBackground (RGBA): " + this.background["r"] + " " + this.background["g"] + " " + this.background["b"] + " " + this.background["a"]);

    console.log("\n---Ilumination done---");
};

Parser.prototype.Lights = function (rootElement) {
    console.log("\n---Lights init---");

    var lightTag = rootElement.getElementsByTagName("LIGHTS")[0];
    if (lightTag == null) {
        return "\nLights element is missing.";
    }

    //---LIGHT---//
    var lightTag = lightTag.getElementsByTagName("LIGHT");
    if (lightTag == null) {
        return "\nLight element is missing.";
    }
    if (lightTag.length < 1) {
        return "\nInvalid number of LIGHT elements";
    }

    for (var i = 0; i < lightTag.length; i++) {

        var light = [];
        var lightStuff = lightTag[i];

        //---ID---//
        light["id"] = this.reader.getString(lightStuff, "id", true);
        if (light["id"] == null) {
            return "\nID element is missing.";
        }

        if (!this.existsID(this.lights, light["id"], this.lights.length)) {
            console.log("\nID: " + light["id"]);

            //---ENABLE---//
            var elements = lightStuff.getElementsByTagName("enable");
            var enable = elements[0];
            if (elements == null) {
                return "\nEnable element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Enable elements";
            }
            light["enable"] = this.reader.getBoolean(enable, "value", true);
            console.log("\nEnable: " + light["enable"]);

            //---POSITION---//
            var elements = lightStuff.getElementsByTagName("position");
            var position = elements[0];
            if (elements == null) {
                return "\nPosition element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Position elements";
            }
            light["position"] = [];
            light["position"]["x"] = this.reader.getFloat(position, "x", true);
            light["position"]["y"] = this.reader.getFloat(position, "y", true);
            light["position"]["z"] = this.reader.getFloat(position, "z", true);
            light["position"]["w"] = this.reader.getFloat(position, "w", true);
            console.log("\nPosition (XYZW): " + light["position"]["x"] + " " + light["position"]["y"] + " " + light["position"]["z"] + " " + light["position"]["w"]);

            //---AMBIENT---//
            var elements = lightStuff.getElementsByTagName("ambient");
            var ambient = elements[0];
            if (elements == null) {
                return "\nAmbient element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Ambient elements";
            }
            light["ambient"] = [];
            light["ambient"]["r"] = this.reader.getFloat(ambient, "r", true);
            light["ambient"]["g"] = this.reader.getFloat(ambient, "g", true);
            light["ambient"]["b"] = this.reader.getFloat(ambient, "b", true);
            light["ambient"]["a"] = this.reader.getFloat(ambient, "a", true);
            console.log("\nAmbient (RGBA): " + light["ambient"]["r"] + " " + light["ambient"]["g"] + " " + light["ambient"]["b"] + " " + light["ambient"]["a"]);

            //---DIFFUSE---//
            var elements = lightStuff.getElementsByTagName("diffuse");
            var diffuse = elements[0];
            if (elements == null) {
                return "\nDiffuse element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Diffuse elements";
            }
            light["diffuse"] = [];
            light["diffuse"]["r"] = this.reader.getFloat(diffuse, "r", true);
            light["diffuse"]["g"] = this.reader.getFloat(diffuse, "g", true);
            light["diffuse"]["b"] = this.reader.getFloat(diffuse, "b", true);
            light["diffuse"]["a"] = this.reader.getFloat(diffuse, "a", true);
            console.log("\nDiffuse (RGBA): " + light["diffuse"]["r"] + " " + light["diffuse"]["g"] + " " + light["diffuse"]["b"] + " " + light["diffuse"]["a"]);

            //---SPECULAR---//
            var elements = lightStuff.getElementsByTagName("specular");
            var specular = elements[0];
            if (elements == null) {
                return "\nSpecular element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Specular elements";
            }
            light["specular"] = [];
            light["specular"]["r"] = this.reader.getFloat(specular, "r", true);
            light["specular"]["g"] = this.reader.getFloat(specular, "g", true);
            light["specular"]["b"] = this.reader.getFloat(specular, "b", true);
            light["specular"]["a"] = this.reader.getFloat(specular, "a", true);
            console.log("\nSpecular (RGBA): " + light["specular"]["r"] + " " + light["specular"]["g"] + " " + light["specular"]["b"] + " " + light["specular"]["a"]);

            this.lights[i] = light;
        }
    }

    console.log("\n---Lights done---");
};

Parser.prototype.Textures = function (rootElement) {
    console.log("\n---Textures init---");

    var TexturesTemp = rootElement.getElementsByTagName("TEXTURES")[0];
    if (TexturesTemp == null) {
        return "\nTextures element is missing.";
    }

    //---TEXTURE---//
    var TexturesTemp = TexturesTemp.getElementsByTagName("TEXTURE");
    if (TexturesTemp == null) {
        return "\nTexture element is missing.";
    }
    if (TexturesTemp.length < 1) {
        return "\nInvalid number of Texture elements";
    }

    var textures = [];
    var id, path, factor_s, factor_t;

    for (var i = 0; i < TexturesTemp.length; i++) {

        var textureStuff = TexturesTemp[i];

        //---ID---//
        id = this.reader.getString(textureStuff, "id", true);
        if (id == null) {
            return "\nID element is missing.";
        }

        if (!this.existsID(this.textures, id, this.textures.length)) {
            console.log("\nID: " + id);

            //---FILE---//
            var elements = textureStuff.getElementsByTagName("file");
            var element_path = elements[0];
            if (elements == null) {
                return "\nFile Path element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of File Path elements";
            }
            path = this.reader.getString(element_path, "path", true);

            var aux = this.reader.xmlfile.substring(0, this.reader.xmlfile.lastIndexOf("/"));
            path = aux + "/" + path;

            console.log("\nFile Path: " + path);

            //---AMPLIF_FACTOR---//
            var elements = textureStuff.getElementsByTagName("amplif_factor");
            var amplif_factor = elements[0];
            if (elements == null) {
                return "\nAmplif_factor element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Amplif_factor elements";
            }
            factor_s = this.reader.getFloat(amplif_factor, "s", true);
            factor_t = this.reader.getFloat(amplif_factor, "t", true);
            console.log("\nAmplif_factor (S T): " + factor_s + " " + factor_t);

            //--- Create texture and add to array
            this.textures[id] = new Texture(id, this.scene, path, factor_s, factor_t);
        }
    }

    console.log("\n---Textures done---");
};


Parser.prototype.Materials = function (rootElement) {
    console.log("\n---Materials init---");

    var materialTag = rootElement.getElementsByTagName("MATERIALS")[0];
    if (materialTag == null) {
        return "\nMaterials element is missing.";
    }

    //---MATERIAL---//
    var materialTag = materialTag.getElementsByTagName("MATERIAL");
    if (materialTag == null) {
        return "\nMaterial element is missing.";
    }
    if (materialTag.length < 1) {
        return "\nInvalid number of Material elements";
    }

    var materials = [];
    var id, shininess;
    var diffuse = [];
    var specular = [];
    var ambient = [];
    var emission = [];

    for (var i = 0; i < materialTag.length; i++) {

        var materialStuff = materialTag[i];

        //---ID---//
        id = this.reader.getString(materialStuff, "id", true);
        if (id == null) {
            return "\nID element is missing.";
        }

        if (!this.existsID(this.materials, id, this.materials.length)) {
            console.log("\nID: " + id);

            //---SHININESS---//
            var elements = materialStuff.getElementsByTagName("shininess");
            var element_shininess = elements[0];
            if (elements == null) {
                return "\nShininess element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Shininess elements";
            }
            shininess = this.reader.getFloat(element_shininess, "value", true);
            console.log("\nShininess: " + shininess);

            //---SPECULAR---//
            var elements = materialStuff.getElementsByTagName("specular");
            var element_specular = elements[0];
            if (elements == null) {
                return "\nSpecular element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Specular elements";
            }
            specular["r"] = this.reader.getFloat(element_specular, "r", true);
            specular["g"] = this.reader.getFloat(element_specular, "g", true);
            specular["b"] = this.reader.getFloat(element_specular, "b", true);
            specular["a"] = this.reader.getFloat(element_specular, "a", true);
            console.log("\nSpecular (RGBA): " + specular["r"] + " " + specular["g"] + " " + specular["b"] + " " + specular["a"]);

            //---DIFFUSE---//
            var elements = materialStuff.getElementsByTagName("diffuse");
            var element_diffuse = elements[0];
            if (elements == null) {
                return "\nDiffuse element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Diffuse elements";
            }
            diffuse["r"] = this.reader.getFloat(element_diffuse, "r", true);
            diffuse["g"] = this.reader.getFloat(element_diffuse, "g", true);
            diffuse["b"] = this.reader.getFloat(element_diffuse, "b", true);
            diffuse["a"] = this.reader.getFloat(element_diffuse, "a", true);
            console.log("\nDiffuse (RGBA): " + diffuse["r"] + " " + diffuse["g"] + " " + diffuse["b"] + " " + diffuse["a"]);

            //---AMBIENT---//
            var elements = materialStuff.getElementsByTagName("ambient");
            var element_ambient = elements[0];
            if (elements == null) {
                return "\nAmbient element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Ambient elements";
            }
            ambient["r"] = this.reader.getFloat(element_ambient, "r", true);
            ambient["g"] = this.reader.getFloat(element_ambient, "g", true);
            ambient["b"] = this.reader.getFloat(element_ambient, "b", true);
            ambient["a"] = this.reader.getFloat(element_ambient, "a", true);
            console.log("\nAmbient (RGBA): " + ambient["r"] + " " + ambient["g"] + " " + ambient["b"] + " " + ambient["a"]);

            //---EMISSION---//
            var elements = materialStuff.getElementsByTagName("emission");
            var element_emission = elements[0];
            if (elements == null) {
                return "\nEmission element is missing.";
            }
            if (elements.length != 1) {
                return "\nInvalid number of Emission elements";
            }
            emission["r"] = this.reader.getFloat(element_emission, "r", true);
            emission["g"] = this.reader.getFloat(element_emission, "g", true);
            emission["b"] = this.reader.getFloat(element_emission, "b", true);
            emission["a"] = this.reader.getFloat(element_emission, "a", true);
            console.log("\nEmission (RGBA): " + emission["r"] + " " + emission["g"] + " " + emission["b"] + " " + emission["a"]);

            //--- Create material and add to array
            this.materials[id] = new Material(id, this.scene, shininess, specular, diffuse, ambient, emission);
        }
    }

    console.log("\n---Materials done---");
};

Parser.prototype.Leaves = function (rootElement) {
    console.log("\n---Leaves init---");

    var leavesTag = rootElement.getElementsByTagName("LEAVES")[0];
    if (leavesTag == null) {
        return "\nLeaves element is missing.";
    }

    //---LEAF---//
    var leavesTag = leavesTag.getElementsByTagName("LEAF");
    if (leavesTag == null) {
        return "\nLeaf element is missing.";
    }
    if (leavesTag.length < 1) {
        return "\nInvalid number of Leaf elements";
    }

    for (var i = 0; i < leavesTag.length; i++) {

        var leaf = [];
        var leafStuff = leavesTag[i];

        //---ID---//
        leaf['id'] = this.reader.getString(leafStuff, "id", true);
        if (leaf['id'] == null) {
            return "\nID element is missing.";
        }

        if (!this.existsID(this.leaves, leaf['id'], this.leaves.length)) {

            console.log("\nID: " + leaf['id']);

            //---TYPE---//
            leaf['type'] = this.reader.getString(leafStuff, "type", true);
            if (leaf['type'] == null) {
                return "\nType element is missing.";
            }
            console.log("\nType: " + leaf['type']);

            if (leaf.type == "rectangle" || leaf.type == "cylinder" || leaf.type == "sphere" ||
                leaf.type == "triangle") {
                //---ARGS---//
                var args = this.reader.getString(leafStuff, "args", true);
                var split = args.split(" ");

                switch (leaf.type) {
                    case "rectangle":
                        leaf["x1"] = parseFloat(split[0]);
                        leaf["x2"] = parseFloat(split[1]);
                        leaf["y1"] = parseFloat(split[2]);
                        leaf["y2"] = parseFloat(split[3]);
                        console.log("\nArgs(x1,x2,y1,y2): " + leaf["x1"] + " " + leaf["x2"] + " " + leaf["y1"] + " " + leaf["y2"]);
                        leaf["display"] = new Rectangle(this.scene, leaf["x1"], leaf["x2"], leaf["y1"], leaf["y2"], 1, 1);
                        break;

                    case "cylinder":
                        leaf["height"] = parseFloat(split[0]);
                        leaf["bottom_r"] = parseFloat(split[1]);
                        leaf["top_r"] = parseFloat(split[2]);
                        leaf["sections_h"] = parseInt(split[3]);
                        leaf["parts_sec"] = parseInt(split[4]);
                        console.log("\nArgs(height, bottom_r, top_r, sections_h, parts_sec): " + leaf["height"] + " " + leaf["bottom_r"] + " " + leaf["top_r"] + " " + leaf["sections_h"] + " " + leaf["parts_sec"]);
                        leaf["display"] = new Cylinder(this.scene, leaf["height"], leaf["bottom_r"], leaf["top_r"], leaf["sections_h"], leaf["parts_sec"], 1, 1);
                        break;

                    case "sphere":
                        leaf["radius"] = parseFloat(split[0]);
                        leaf["parts_r"] = parseInt(split[1]);
                        leaf["parts_sec"] = parseInt(split[2]);
                        console.log("\nArgs(radius, parts_r, parts_sec): " + leaf["radius"] + " " + leaf["parts_r"] + " " + leaf["parts_sec"]);
                        leaf["display"] = new Sphere(this.scene, leaf["radius"], leaf["parts_r"], leaf["parts_sec"], 1, 1);
                        break;

                    case "triangle":
                        leaf["xt_1"] = parseFloat(split[0]);
                        leaf["yt_1"] = parseFloat(split[1]);
                        leaf["zt_1"] = parseFloat(split[2]);

                        leaf["xt_2"] = parseFloat(split[3]);
                        leaf["yt_2"] = parseFloat(split[4]);
                        leaf["zt_2"] = parseFloat(split[5]);

                        leaf["xt_3"] = parseFloat(split[6]);
                        leaf["yt_3"] = parseFloat(split[7]);
                        leaf["zt_3"] = parseFloat(split[8]);
                        console.log("\nArgs(xt_1, yt_1, zt_1, xt_2, yt_2, zt_2, xt_3, yt_3, zt_3): " + leaf["xt_1"] + " " + leaf["yt_1"] + " " + leaf["zt_1"] + " " + leaf["xt_2"] + " " + leaf["yt_2"] + " " + leaf["zt_2"] + " " + leaf["xt_3"] + " " + leaf["yt_3"] + " " + leaf["zt_3"]);
                        leaf["display"] = new Triangle(this.scene, leaf["xt_1"], leaf["yt_1"], leaf["zt_1"], leaf["xt_2"], leaf["yt_2"], leaf["zt_2"], leaf["xt_3"], leaf["yt_3"], leaf["zt_3"], 1, 1);
                        break;

                    default:
                        return "Leaf type unknow";
                }
            }

            else {
                switch (leaf.type) {
                    case "plane":
                        leaf['parts'] = this.reader.getInteger(leafStuff, "parts", true);
                        console.log("\nParts: " + leaf['parts']);
                        leaf["display"] = new Plane(this.scene, leaf['parts'], 1, 1);
                        break;

                    case "patch":
                        leaf['order'] = this.reader.getInteger(leafStuff, "order", true);
                        console.log("\nOrder: " + leaf['order']);
                        leaf['partsU'] = this.reader.getInteger(leafStuff, "partsU", true);
                        console.log("\nPartsU: " + leaf['partsU']);
                        leaf['partsV'] = this.reader.getInteger(leafStuff, "partsV", true);
                        console.log("\nPartsV: " + leaf['partsV']);

                        var ControlPointsTag = leafStuff.getElementsByTagName("CONTROLPOINT");
                        if (ControlPointsTag == null) {
                            return "\nControlPoint element is missing.";
                        }
                        if (ControlPointsTag.length < 1) {
                            return "\nInvalid number of ControlPoint elements";
                        }

                        var controlPoints = [];

                        for (var k = 0; k < ControlPointsTag.length; k++) {
                            var ControlPointStuff = ControlPointsTag[k];

                            var controlPoint = [];
                            var controlPointAux = 0;

                            //---X---//
                            controlPointAux = this.reader.getFloat(ControlPointStuff, "x", true);
                            if (controlPointAux == null) {
                                return "\nX element is missing.";
                            }
                            console.log("\nX: " + controlPointAux);
                            controlPoint.push(controlPointAux);

                            //---Y---//
                            controlPointAux = 0;
                            controlPointAux = this.reader.getFloat(ControlPointStuff, "y", true);
                            if (controlPointAux == null) {
                                return "\nY element is missing.";
                            }
                            console.log("\nY: " + controlPointAux);
                            controlPoint.push(controlPointAux);

                            //---Z---//
                            controlPointAux = 0;
                            controlPointAux = this.reader.getFloat(ControlPointStuff, "z", true);
                            if (controlPointAux == null) {
                                return "\nZ element is missing.";
                            }
                            console.log("\nZ: " + controlPointAux);
                            controlPoint.push(controlPointAux);

                            controlPoint.push(1);

                            controlPoints.push(controlPoint);
                        }

                        leaf["display"] = new Patch(this.scene, leaf['order'], leaf['partsU'], leaf['partsV'], controlPoints, 1, 1);
                        break;

                    case "vehicle":
                        leaf["display"] = new Vehicle(this.scene, 1, 1);
                        break;

                    case "terrain":

                        var path = this.reader.getString(leafStuff, "texture", true);
                        var aux = this.reader.xmlfile.substring(0, this.reader.xmlfile.lastIndexOf("/"));
                        leaf['texture'] = aux + "/" + path;
                        console.log("\nTexture: " + leaf['texture']);

                        path = this.reader.getString(leafStuff, "heightmap", true);
                        var aux = this.reader.xmlfile.substring(0, this.reader.xmlfile.lastIndexOf("/"));
                        leaf['heightmap'] = aux + "/" + path;
                        console.log("\nHeightmap: " + leaf['heightmap']);
                        leaf["display"] = new Terrain(this.scene, leaf['texture'], leaf['heightmap'], 1, 1);
                        break;

                    case "cube":

                        console.log("New cube");
                        leaf["display"] = new Cube(this.scene);
                        break;

                    default:
                        return "Leaf type unknow";
                }

            }

            this.leaves[leaf['id']] = leaf["display"];
        }
    }
    console.log("\n---Leaves done---");
};

Parser.prototype.Animations = function (rootElement) {
    console.log("\n---Animations init---");

    var AnimationsTemp = rootElement.getElementsByTagName("ANIMATIONS")[0];
    if (AnimationsTemp != null) {

        //---Animation---//
        var AnimationsTemp = AnimationsTemp.getElementsByTagName("ANIMATION");
        if (AnimationsTemp == null) {
            return "\nAnimation element is missing.";
        }
        if (AnimationsTemp.length < 1) {
            return "\nInvalid number of Animation elements";
        }

        var animations = [];
        var id, span, type;

        var radius, startang, rotang;

        for (var i = 0; i < AnimationsTemp.length; i++) {
            var center = [];

            var AnimationStuff = AnimationsTemp[i];

            //---ID---//
            id = this.reader.getString(AnimationStuff, "id", true);
            if (id == null) {
                return "\nID element is missing.";
            }

            if (!this.existsID(this.animations, id, this.animations.length)) {
                console.log("\nID: " + id);

                //---SPAN---//
                span = this.reader.getFloat(AnimationStuff, "span", true);
                if (span == null) {
                    return "\nSpan element is missing.";
                }
                console.log("\nSpan: " + span);

                //---TYPE---//
                type = this.reader.getString(AnimationStuff, "type", true);
                if (type == null) {
                    return "\nType element is missing.";
                }
                console.log("\nType: " + type);

                switch (type) {
                    case "linear":

                        var ControlPointsTag = AnimationStuff.getElementsByTagName("CONTROLPOINT");
                        if (ControlPointsTag == null) {
                            return "\nControlPoint element is missing.";
                        }
                        if (ControlPointsTag.length < 1) {
                            return "\nInvalid number of ControlPoint elements";
                        }

                        var controlPoints = [];

                        for (var k = 0; k < ControlPointsTag.length; k++) {
                            var ControlPointStuff = ControlPointsTag[k];

                            var controlPoint = [];

                            //---XX---//
                            controlPoint["xx"] = this.reader.getFloat(ControlPointStuff, "xx", true);
                            if (controlPoint["xx"] == null) {
                                return "\nXX element is missing.";
                            }
                            console.log("\nXX: " + controlPoint["xx"]);

                            //---YY---//
                            controlPoint["yy"] = this.reader.getFloat(ControlPointStuff, "yy", true);
                            if (controlPoint["yy"] == null) {
                                return "\nYY element is missing.";
                            }
                            console.log("\nYY: " + controlPoint["yy"]);

                            //---ZZ---//
                            controlPoint["zz"] = this.reader.getFloat(ControlPointStuff, "zz", true);
                            if (controlPoint["zz"] == null) {
                                return "\nZZ element is missing.";
                            }
                            console.log("\nZZ: " + controlPoint["zz"]);

                            controlPoints.push(controlPoint);
                        }

                        this.animations[id] = new LinearAnimation(this.scene, span, controlPoints);


                        break;

                    case "circular":
                        //---CENTER---//
                        var centerString = this.reader.getString(AnimationStuff, "center", true);
                        if (centerString == null) {
                            return "\nType element is missing.";
                        }
                        var split = centerString.split(" ");

                        center["x"] = parseFloat(split[0]);
                        center["y"] = parseFloat(split[1]);
                        center["z"] = parseFloat(split[2]);

                        console.log("\nCenter (x,y,z) : " + center["x"] + " " + center["y"] + " " + center["z"]);

                        //---RADIUS---//
                        radius = this.reader.getFloat(AnimationStuff, "radius", true);
                        if (radius == null) {
                            return "\nRadius element is missing.";
                        }
                        console.log("\nRadius: " + radius);

                        //---STARTANG---//
                        startang = this.reader.getFloat(AnimationStuff, "startang", true);
                        if (startang == null) {
                            return "\nStartang element is missing.";
                        }
                        console.log("\nStartang: " + startang);

                        //---ROTANG---//
                        rotang = this.reader.getFloat(AnimationStuff, "rotang", true);
                        if (rotang == null) {
                            return "\nRotang element is missing.";
                        }
                        console.log("\nRotang: " + rotang);

                        this.animations[id] = new CircularAnimation(this.scene, span, center, radius, startang, rotang);
                        break;

                    default:
                        return "Animation type unknow";
                }
            }
        }
    }

    console.log("\n---Animations done---");
};

Parser.prototype.Nodes = function (rootElement) {
    console.log("\n---Nodes init---");

    var nodesTag = rootElement.getElementsByTagName("NODES")[0];
    if (nodesTag == null) {
        return "\nNodes element is missing.";
    }

    var rootTag = rootElement.getElementsByTagName("ROOT")[0];
    if (rootTag == null) {
        return "\nRoot element is missing.";
    }
    this.root = this.reader.getString(rootTag, "id", true);
    console.log("\nROOT: " + this.root);

    //---NODE---//
    var nodeTag = nodesTag.getElementsByTagName("NODE");
    if (nodeTag == null) {
        return "\nNode element is missing.";
    }
    if (nodeTag.length < 1) {
        return "\nInvalid number of Node elements";
    }

    var id, nodeID;
    var material = "null";
    var texture = "null";
    var animation;
    var pickingtable = false;
    var translate = [];
    var rotation = [];
    var scale = [];
    var animats = [];

    for (var i = 0; i < nodeTag.length; i++) {
        animation = [];
        var nodeStuff = nodeTag[i];
        animats = [];
        //---ID---//
        nodeID = this.reader.getString(nodeStuff, "id", true);
        if (nodeID == null) {
            return "\nID element is missing.";
        }

        if (!this.existsID(this.nodes, nodeID, this.nodes.length)) {
            console.log("\nNode ID: " + nodeID);

            //---Is a place---//
            var isplace = nodeID.substring(0, 5);
            if (isplace == "Place") {
                pickingtable = true;
            }
            else {
                pickingtable = false;
            }

            //---MATERIAL---//
            var materialTag = nodeStuff.getElementsByTagName("MATERIAL")[0];
            if (materialTag == null) {
                return "\nMaterial element is missing.";
            }
            material = this.reader.getString(materialTag, "id", true);
            console.log("\nMaterial: " + material);

            //---TEXTURE---//
            var textureTag = nodeStuff.getElementsByTagName("TEXTURE")[0];
            if (textureTag == null) {
                return "\nTexture element is missing.";
            }
            texture = this.reader.getString(textureTag, "id", true);
            console.log("\nTexture: " + texture);

            //---ANIMATION---//
            var animationsTag = nodeStuff.getElementsByTagName("ANIMATIONS")[0];

            if (animationsTag != undefined) {

                var animationTag = animationsTag.getElementsByTagName("ANIMATION");

                for (var m = 0; m < animationTag.length; m++) {
                    var animationStuff = animationTag[m];

                    //---Animation---//
                    animation = this.reader.getString(animationStuff, "id", true);
                    if (animation == null) {
                        return "\nID element is missing.";
                    }
                    console.log("Animation: " + animation);
                    animats.push(animation);
                }
            }


            var j = 2;
            var matrix = mat4.create();
            mat4.identity(matrix);
            while (true) {
                if (nodeStuff.children[j].tagName == 'TRANSLATION') {
                    var translat = [];

                    translat.x = this.reader.getFloat(nodeStuff.children[j], 'x', true);
                    console.log("\nTranslation x: " + translat.x);
                    translat.y = this.reader.getFloat(nodeStuff.children[j], 'y', true);
                    console.log("\nTranslation y: " + translat.y);
                    translat.z = this.reader.getFloat(nodeStuff.children[j], 'z', true);
                    console.log("\nTranslation z: " + translat.z);

                    mat4.translate(matrix, matrix, [translat.x, translat.y, translat.z]);
                }

                else if (nodeStuff.children[j].tagName == 'ROTATION') {


                    rotation['axis'] = this.reader.getString(nodeStuff.children[j], 'axis', true);
                    var rotAux = rotation['axis'];
                    if (rotAux != 'x' && rotAux != 'y' && rotAux != 'z') {
                        return "\nInvalid axis for Rotation elements";
                    }
                    rotation['angle'] = this.reader.getFloat(nodeStuff.children[j], 'angle', true);
                    console.log("\nRotation (axis - angle): " + rotation['axis'] + " - " + rotation['angle']);

                    mat4.rotate(matrix, matrix, rotation['angle'] * Math.PI / 180, [rotation['axis'] == "x" ? 1 : 0, rotation['axis'] == "y" ? 1 : 0, rotation['axis'] == "z" ? 1 : 0]);

                }

                else if (nodeStuff.children[j].tagName == 'SCALE') {
                    var scal = [];

                    scal.x = this.reader.getFloat(nodeStuff.children[j], "sx", true);
                    console.log("\nScale sx: " + scal.x);
                    scal.y = this.reader.getFloat(nodeStuff.children[j], "sy", true);
                    console.log("\nScale sy: " + scal.y);
                    scal.z = this.reader.getFloat(nodeStuff.children[j], "sz", true);
                    console.log("\nScale sz: " + scal.z);

                    mat4.scale(matrix, matrix, [scal.x, scal.y, scal.z]);
                }

                else {
                    break;
                }

                j++;
            }

            //---CREATE NODE---//
            var node = new Node(nodeID, material, texture, animats, pickingtable);
            node.setMatrix(matrix);

            //---ADD DESCENDANTS---//
            var descendantsElems = nodeStuff.getElementsByTagName("DESCENDANTS")[0];
            if (descendantsElems == null) {
                return "\nDescendants element is missing.";
            }

            var descendantTag = descendantsElems.getElementsByTagName("DESCENDANT");
            if (descendantTag == null) {
                return "\nDescendant element is missing.";
            }
            if (descendantTag.length < 1) {
                return "\nInvalid number of Node elements";
            }

            for (var k = 0; k < descendantTag.length; k++) {
                var descendantStuff = descendantTag[k];

                //---Descendant---//
                id = this.reader.getString(descendantStuff, "id", true);
                if (id == null) {
                    return "\nID element is missing.";
                }
                node.addDescendant(id);
            }

            //Add node to array
            this.nodes[nodeID] = node;
        }
    }
    console.log("\n---Nodes done---");
};

Parser.prototype.existsID = function (array, elemento, tamanho) {
    var exist = false;

    if (tamanho == 0) {
        return exist;
    }

    else {
        for (var j = 0; j < tamanho; j++) {
            if (array[j]["id"] == elemento) {
                exist = true;
                console.log("\ID " + elemento + " already in use!");
            }
        }
    }
    return exist;
};

/*
 * Callback to be executed on any read error
 */

Parser.prototype.onXMLError = function (message) {
    console.error("XML Loading Error: " + message);
    this.loadedOk = false;
};
