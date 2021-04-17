uniform vec2 gamma;

uniform sampler2D textureSampler;

// uniform vec2 enabled;

out vec4 gl_FragColor;

void main() {
  float levels = 6.0;

  ivec2 itexSize  = textureSize(textureSampler, 0).xy;
  vec2 texSize = vec2(itexSize.x, itexSize.y);
  vec2 texCoord = gl_FragCoord.xy / texSize;

  // Avoid the background.
//   vec4 position = texture(positionTexture, texCoord);
//   if (position.a <= 0) { fragColor = vec4(0); return; }

  G = texture(textureSampler, texCoord);

//   if (enabled.x != 1) { return; }

  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(gamma.y));

  float greyscale = max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b));

  float lower     = floor(greyscale * levels) / levels;
  float lowerDiff = abs(greyscale - lower);

  float upper     = ceil(greyscale * levels) / levels;
  float upperDiff = abs(upper - greyscale);

  float level      = lowerDiff <= upperDiff ? lower : upper;
  float adjustment = level / greyscale;

  gl_FragColor.rgb = gl_FragColor.rgb * adjustment;

  gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(gamma.x));
}