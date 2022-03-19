uniform float uTime;
uniform sampler2D uTexture;
uniform sampler2D uTextTexture;
uniform sampler2D uDisplacement;
uniform vec3 uMouse;

varying vec2 vUv;
varying vec3 vPosition;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  // vec4 displacement = texture2D(uDisplacement, vUv.yx);

  // vec2 displacedUV = vUv;
  // displacedUV.y = mix(vUv.y, displacement.r, .1);

  // vec4 image = texture2D(uTexture, displacedUV);
  // image.r = texture2D(uTexture, displacedUV + vec2(0., 3. * .005)).r;
  // image.g = texture2D(uTexture, displacedUV + vec2(0., 3. * .01)).g;
  // image.b = texture2D(uTexture, displacedUV + vec2(0., 3. * .02)).b;

  // vec2 dirVec = normalize(vPosition.xy - uMouse.xy);
  float dist = 1. - map(length(vPosition - uMouse), 0., .3, 0., 1.);
  dist = clamp(dist, 0., 1.);

  vec2 zoomedUV = mix(vUv, uMouse.xy + vec2(.5), dist * 0.4);

  vec4 image = texture2D(uTextTexture, zoomedUV);

  gl_FragColor = image;
  // gl_FragColor = vec4(dirVec, 0., 1.);
}
