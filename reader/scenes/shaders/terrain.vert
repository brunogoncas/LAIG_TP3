#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D uSampler2;

uniform float scale_factor;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    vec4 texColor = texture2D(uSampler2, aTextureCoord);
	vec3 offset = vec3(0.0,texture2D(uSampler2, vTextureCoord).b,0.0);
    offset *= scale_factor;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}