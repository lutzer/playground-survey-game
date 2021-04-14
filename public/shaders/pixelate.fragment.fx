precision highp float;

varying vec2 vUV;

uniform sampler2D textureSampler;

void main(void) {
    vec4 basecolor = texture2D(textureSampler, vUV);
    // base
    gl_FragColor = basecolor;
}