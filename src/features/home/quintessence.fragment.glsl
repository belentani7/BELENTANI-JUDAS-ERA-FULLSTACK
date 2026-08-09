uniform vec3 uAsh;
uniform vec3 uIron;

varying float vEnergy;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float radius = length(centered);
  float core = smoothstep(0.48, 0.04, radius);
  vec3 color = mix(uAsh, uIron, clamp(vEnergy, 0.0, 1.0));
  gl_FragColor = vec4(color, core * 0.62);
}
