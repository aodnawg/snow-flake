const fs = `
precision highp float;

uniform vec2 resolution;
uniform float time;

#define PI 3.141593

mat2 rot(float a) {
  return mat2(cos(a), sin(a), -sin(a), cos(a));
}

float random(float n) {
    return fract(sin(n*318.154121)*31.134131);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
}

vec2 pmod(vec2 p, float r) {
    float a =  atan(p.x, p.y) + PI/r;
    float n = PI*2. / r;
    a = floor(a/n)*n;
    return p*rot(-a);
}

float frake(in vec2 uv, in float factor) {
  uv = pmod(uv, 6.);
  float rate = noise(vec3(uv*5., 1.));
  float r = length(uv);
  uv.y *= rate;
  float a = atan(uv.x, uv.y);

  a += time;
  // float vFact = 12.;
  float v = abs(sin(a * 20. * noise(vec3(factor, 15. ,time))));
  v *= 1.4 - r;
  v = smoothstep(1., min(1., pow(r, .5) ) , v);
  // v = smoothstep(1., .95, v);
  return v;
}

void main(void) {
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  vec2 xy = uv;

  uv *= 2.;

  uv = pmod(uv, 6.);

  float rate = noise(vec3(uv*5.+vec2(time), 1.));

  float r = length(uv);
  uv.y *= rate;
  float a = atan(uv.x, uv.y);
  a += time;

  float vFact = 1.;
  float v = abs(sin(a * 20. * noise(vec3(vFact, 15. ,time))));
   
  v *= 1.4 - r;
  v = smoothstep(1., min(1., pow(r, .5) ) , v);
  v = smoothstep(1., .95, v);
  
  // v -= frake(uv, 1.);
  v -= frake(uv, 12.);
  v -= frake(uv * 2., 2.) * .5;
  v -= frake(uv * 1., 4.) * .3;

  float mask = 1. - step(.5, length(xy));
  float alpha = v * mask;

  gl_FragColor = vec4(vec3(.88, .82, .98), alpha);
}
`;

export default fs;
