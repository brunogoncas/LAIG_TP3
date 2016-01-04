function Node(id, material, texture, animations, pickingtable) {
    this.id = id;
    this.material = material;
    this.texture = texture;
    this.matrix = null;
    this.descendants = [];
    this.primitive = null;
    this.animations = animations;
    this.pickingtable = pickingtable;

    this.animationsObj = [];
    this.activeAnimation = null;
    this.currentAnimation = 0;

};

Node.prototype = Object.create(Object.prototype);
Node.prototype.constructor = Node;

Node.prototype.setMatrix = function (matrix) {
    this.matrix = mat4.clone(matrix);
    console.log("Matrix = " + this.matrix);
};

Node.prototype.addDescendant = function (nodeId) {
    this.descendants.push(nodeId);
    console.log("Add descendant = " + this.descendants);
};
