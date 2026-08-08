attribute vec3 aTarget;
attribute float aScale;

uniform float uMorph;
uniform float uTime;

varying float vEnergy;

void main() {
  float phase = smoothstep(0.08, 0.92, uMorph);
  vec3 positionNow = mix(position, aTarget, phase);
  float breath = sin(uTime * 1.4 + length(positionNow) * 2.1) * 0.045;
  positionNow *= 1.0 + breath;
  positionNow.x += sin(uTime * 0.32 + positionNow.y) * (1.0 - phase) * 0.12;

  vec4 viewPosition = modelViewMatrix * vec4(positionNow, 1.0);
  gl_PointSize = max(1.0, aScale * (34.0 / -viewPosition.z));
  gl_Position = projectionMatrix * viewPosition;
  vEnergy = 0.5 + phase * 0.5 + breath * 4.0;
}
