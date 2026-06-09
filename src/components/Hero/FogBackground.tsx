/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * FogBackground — WebGL2 animated fog shader inside the Hero section.
 *
 * A fullscreen PlaneGeometry equivalent: a quad covering the hero that
 * renders 4-octave fbm noise as drifting dark navy fog. The canvas uses
 * alpha:true so the hero's bg-ink-void CSS background shows through
 * transparent areas — fog is additive, not a hard replacement.
 *
 * Mouse position offsets the noise UV for a subtle parallax.
 * isBonfireLit transitions the fog from cool dark-navy to warm ember-blood.
 * Disabled on coarse-pointer (touch) devices.
 */

import React, { useRef, useEffect } from 'react';

const VERT = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec2  v_uv;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // -0.5..0.5, centred on viewport
uniform float u_warmth;  // 0=cool, 1=warm (bonfire lit)
out vec4 fragColor;

// ── Value noise ───────────────────────────────────────────────────────────────
float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  // Rotated octaves give more organic swirl than axis-aligned layering
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  float v=0.0, a=0.52;
  for(int i=0;i<4;i++){ v+=a*noise(p); p=rot*p*2.1+0.4; a*=0.46; }
  return v;
}

void main(){
  vec2 uv = v_uv;
  // Mouse parallax — barely perceptible, just enough to feel 3D
  uv += u_mouse * 0.018;

  // Primary slow drift
  vec2 np  = uv * 2.2 + vec2(u_time * 0.022, u_time * 0.014);
  float n  = fbm(np);

  // Secondary faster counter-drift adds depth
  vec2 np2 = uv * 4.6 + vec2(u_time * -0.016, u_time * 0.019);
  float n2 = fbm(np2) * 0.30;

  float fog = clamp(n * 0.72 + n2, 0.0, 1.0);

  // Colours — just barely above ink-void (#07070A)
  vec3 cool = vec3(0.042, 0.052, 0.080);  // dark navy fog
  vec3 warm = vec3(0.078, 0.028, 0.016);  // dark ember fog
  vec3 col  = mix(cool, warm, u_warmth);

  // Edge vignette: pull fog back from viewport edges so hero content pops
  vec2 vig = abs(uv * 2.0 - 1.0);
  float v  = 1.0 - smoothstep(0.55, 1.0, max(vig.x, vig.y));
  fog *= v;

  float density = smoothstep(0.28, 0.68, fog);
  float alpha   = density * 0.72;  // never fully opaque — CSS bg shows through

  // Premultiplied alpha for correct WebGL blending with the page
  fragColor = vec4(col * alpha, alpha);
}`;

function mkShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('[FogBackground shader]', gl.getShaderInfoLog(s));
  return s;
}

interface Props { isBonfireLit: boolean }

export const FogBackground: React.FC<Props> = ({ isBonfireLit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const warmRef   = useRef(0);

  // Mirror prop into ref for RAF loop
  useEffect(() => {
    const target = isBonfireLit ? 1 : 0;
    const STEP = 0.03;
    const id = setInterval(() => {
      warmRef.current += (target - warmRef.current) * STEP;
    }, 16);
    return () => clearInterval(id);
  }, [isBonfireLit]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true });
    if (!gl) return;

    // ── Program ───────────────────────────────────────────────────────────────
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1, -1,1,  1,-1, 1,1, -1,1,
    ]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied

    const uRes    = gl.getUniformLocation(prog, 'u_res');
    const uTime   = gl.getUniformLocation(prog, 'u_time');
    const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
    const uWarmth = gl.getUniformLocation(prog, 'u_warmth');

    let W = 0, H = 0, mx = 0, my = 0, rafId = 0;

    const resize = () => {
      const parent = canvas.parentElement!;
      W = parent.clientWidth;
      H = parent.clientHeight || window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
    };

    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth)  - 0.5;
      my = (e.clientY / window.innerHeight) - 0.5;
    };

    const obs = new ResizeObserver(resize);
    if (canvas.parentElement) obs.observe(canvas.parentElement);
    window.addEventListener('mousemove', onMove, { passive: true });
    resize();

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, now * 0.001);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform1f(uWarmth, warmRef.current);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      window.removeEventListener('mousemove', onMove);
      gl.deleteProgram(prog);
      gl.deleteBuffer(quad);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
