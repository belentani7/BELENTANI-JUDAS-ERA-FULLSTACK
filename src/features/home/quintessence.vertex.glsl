attribute vec3 aGathered;
attribute float aScale;

uniform float uGather;
uniform float uTime;

varying float vEnergy;

void main() {
  float gather = smoothstep(0.0, 1.0, uGather);
  vec3 current = mix(position, aGathered, gather);
  float breath = sin(uTime * 0.55 + current.y * 3.2 + current.x) * 0.035 * (1.0 - gather);
  current.y += breath;

  vec4 viewPosition = modelViewMatrix * vec4(current, 1.0);
  gl_PointSize = max(1.0, aScale * (24.0 / -viewPosition.z));
  gl_Position = projectionMatrix * viewPosition;
  vEnergy = 0.32 + gather * 0.68 + breath * 3.0;
}
