/**
 * Canlı kişilik şeklinin gölgelendiricileri (WebGL, GLSL ES 1.00; WebGL 1 ve 2'de çalışır). Birim
 * kürenin her noktası, beş kişilik boyutundan türetilen parametrelerle (lib/persona-shape.ts) gürültü
 * ve düzenli loblar karışımıyla içe ya da dışa itilir; yüzey normali komşu noktalardan yeniden
 * hesaplanır. Renk, beş yönün her birine bir boyutun rengi verilerek karıştırılır; boyutun değeri
 * arttıkça o rengin payı büyür. Hesaplar doğrusal renk uzayında yapılır, çıkışta sRGB'ye çevrilir.
 *
 * Üç boyutlu simpleks gürültü: Ian McEwan ve Stefan Gustavson, "webgl-noise" (MIT Lisansı).
 * Copyright (C) 2011 Ashima Arts, (C) 2011–2021 Stefan Gustavson. https://github.com/stegu/webgl-noise
 */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const VERTEX_SHADER = /* glsl */ `
precision highp float;

attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uTime;
uniform float uAmp;
uniform float uFreq;
uniform float uSym;
uniform float uJitter;
uniform float uDetail;
uniform vec3 uPointer;
uniform float uPointerAmt;

varying vec3 vNormalV;
varying vec3 vDir;
varying vec3 vViewPos;
varying float vDisp;

${NOISE}

float displacement(vec3 p) {
  float t = uTime;
  vec3 q = p * uFreq;
  // Yumuşak ana dalga ve onun iki katı sıklıkta, merakla artan ikinci bir katman.
  float organic = snoise(q + vec3(0.0, t * 0.7, t * 0.45)) * 0.9
                + snoise(q * 1.75 + vec3(t * 0.9, 0.0, -t * 0.7)) * uDetail;
  // Düzen: ekvator çevresinde eşit aralıklı beş lob ve kutuplarda yumuşak bir basıklık.
  float phi = atan(p.z, p.x);
  float sinT = sqrt(max(1.0 - p.y * p.y, 0.0));
  float ordered = cos(5.0 * phi + t * 0.6) * sinT * sinT * sinT * 0.8 + (2.0 * p.y * p.y - 1.0) * 0.22;
  float shape = mix(organic, ordered, uSym * 0.82);
  // Titreşim yüzeyi pürüzlendirmez: şekil bütün olarak, daha hızlı ve düzensiz sallanır.
  float wobble = snoise(p * 1.5 + vec3(t * 4.0, -t * 3.2, t * 2.6)) * uJitter;
  float bump = uPointerAmt * smoothstep(0.55, 1.0, dot(p, uPointer)) * 0.26;
  return uAmp * shape + wobble + bump;
}

void main() {
  vec3 dir = normalize(position);
  vec3 helper = abs(dir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 tangent = normalize(cross(dir, helper));
  vec3 bitangent = cross(dir, tangent);
  const float e = 0.012;
  float d0 = displacement(dir);
  vec3 p0 = dir * (1.0 + d0);
  vec3 dA = normalize(dir + tangent * e);
  vec3 dB = normalize(dir + bitangent * e);
  vec3 pA = dA * (1.0 + displacement(dA));
  vec3 pB = dB * (1.0 + displacement(dB));
  vec3 n = normalize(cross(pA - p0, pB - p0));
  if (dot(n, dir) < 0.0) n = -n;

  vDisp = d0;
  vDir = dir;
  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vViewPos = mv.xyz;
  vNormalV = normalize(normalMatrix * n);
  gl_Position = projectionMatrix * mv;
}
`;

export const FRAGMENT_SHADER = /* glsl */ `
precision highp float;

uniform vec3 uColors[5];
uniform float uWeights[5];
uniform float uDark;

varying vec3 vNormalV;
varying vec3 vDir;
varying vec3 vViewPos;
varying float vDisp;

void addColor(inout vec3 col, inout float ws, vec3 dir, vec3 c, float trait) {
  float w = exp((dot(vDir, dir) - 1.0) * 2.6) * (0.18 + 1.4 * trait * trait);
  col += w * c;
  ws += w;
}

void main() {
  vec3 n = normalize(vNormalV);
  vec3 v = normalize(-vViewPos);
  float ndv = clamp(dot(n, v), 0.0, 1.0);
  float fres = pow(1.0 - ndv, 2.2);

  // Beş boyutun rengi, beşgen biçiminde dağılmış beş yönden gelir.
  vec3 col = vec3(0.0);
  float ws = 0.0;
  addColor(col, ws, normalize(vec3(0.0, 1.0, 0.35)), uColors[0], uWeights[0]);
  addColor(col, ws, normalize(vec3(0.95, 0.31, -0.25)), uColors[1], uWeights[1]);
  addColor(col, ws, normalize(vec3(0.59, -0.81, 0.15)), uColors[2], uWeights[2]);
  addColor(col, ws, normalize(vec3(-0.59, -0.81, -0.15)), uColors[3], uWeights[3]);
  addColor(col, ws, normalize(vec3(-0.95, 0.31, 0.25)), uColors[4], uWeights[4]);
  col /= max(ws, 1e-4);

  vec3 keyL = normalize(vec3(0.45, 0.8, 0.6));
  vec3 fillL = normalize(vec3(-0.7, -0.25, 0.45));
  float diffuse = max(dot(n, keyL), 0.0) * 0.78 + max(dot(n, fillL), 0.0) * 0.28;
  vec3 h = normalize(keyL + v);
  float spec = pow(max(dot(n, h), 0.0), 56.0) * 0.55;

  vec3 irid = 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + fres * 0.85 + vDisp * 1.6));
  vec3 color = col * (0.38 + 0.74 * diffuse);
  color += fres * mix(col, irid, 0.5) * 0.6;
  color += spec;
  color = mix(color, color * 1.12 + 0.03, uDark);
  // Yumuşak ton eşleme: parlak yerler beyaza kaçmasın.
  color = color / (1.0 + max(color - 0.85, 0.0));

  // Doğrusal renkten ekran rengine (sRGB).
  color = clamp(color, 0.0, 1.0);
  color = mix(color * 12.92, 1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, color));
  gl_FragColor = vec4(color, 1.0);
}
`;
