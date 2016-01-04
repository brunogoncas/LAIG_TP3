function Material(id, scene, shininess, specular, diffuse, ambient, emission) {
    this.id = id;

    //Cria material do tipo CGFappearance
    var appearance = new CGFappearance(scene);
    appearance.setShininess(shininess);
    appearance.setSpecular(specular["r"], specular["g"], specular["b"], specular["a"]);
    appearance.setDiffuse(diffuse["r"], diffuse["g"], diffuse["b"], diffuse["a"]);
    appearance.setAmbient(ambient["r"], ambient["g"], ambient["b"], ambient["a"]);
    appearance.setEmission(emission["r"], emission["g"], emission["b"], emission["a"]);

    this.appearance = appearance;
};

Material.prototype = Object.create(Object.prototype);
Material.prototype.constructor = Material;