// Vertex Shader
export const glitchVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader with glitch effects
export const glitchFragmentShader = `
uniform sampler2D tDiffuse;
uniform float time;
uniform float glitchIntensity;
uniform float rgbShift;
uniform float scanlineIntensity;
uniform vec2 resolution;

varying vec2 vUv;

// Random function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  
  // RGB Shift Effect
  float shift = rgbShift * sin(time * 2.0) * 0.01;
  vec2 offsetR = vec2(shift, 0.0);
  vec2 offsetB = vec2(-shift, 0.0);
  
  float r = texture2D(tDiffuse, uv + offsetR).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv + offsetB).b;
  
  vec3 color = vec3(r, g, b);
  
  // Horizontal line glitches
  if (glitchIntensity > 0.0) {
    float lineNoise = random(vec2(floor(uv.y * 100.0), time * 0.1));
    if (lineNoise > 0.95) {
      uv.x += (random(vec2(time, uv.y)) - 0.5) * glitchIntensity * 0.1;
      color = texture2D(tDiffuse, uv).rgb;
    }
  }
  
  // Scanlines
  if (scanlineIntensity > 0.0) {
    float scanline = sin(uv.y * resolution.y * 2.0) * 0.5 + 0.5;
    color *= 1.0 - scanlineIntensity * (1.0 - scanline) * 0.5;
  }
  
  // Random noise blocks
  if (glitchIntensity > 0.0) {
    vec2 blockPos = floor(uv * 20.0);
    float blockNoise = random(vec2(blockPos.x, blockPos.y + time * 0.5));
    if (blockNoise > 0.98) {
      color = vec3(random(blockPos), random(blockPos + 1.0), random(blockPos + 2.0));
    }
  }
  
  gl_FragColor = vec4(color, 1.0);
}
`;
