function Texture(id, scene, path, factor_s, factor_t) {

    this.id = id;
	this.textureCGF = new CGFtexture(scene, path);
    this.amplif_factorS = factor_s || 1;
    this.amplif_factorT = factor_t || 1; 
};

Texture.prototype = Object.create(Object.prototype);
Texture.prototype.constructor = Texture;