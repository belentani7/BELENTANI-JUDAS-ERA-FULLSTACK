uniform vec3 uColor;

varying float vEnergy;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float distanceToCenter = length(centered);
  float core = smoothstep(0.5, 0.02, distanceToCenter);
  float halo = smoothstep(0.5, 0.18, distanceToCenter) * 0.5;
  vec3 color = mix(uColor * 0.28, uColor * 1.18, vEnergy);
  gl_FragColor = vec4(color, (core + halo) * 0.58);
}
