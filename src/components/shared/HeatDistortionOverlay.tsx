/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * HeatDistortionOverlay — WebGL2 heat-shimmer around the cursor.
 *
 * A fullscreen canvas at z-60, pointer-events-none. A fragment shader
 * renders a radial gilt→ember-blood noise field centred on the cursor.
 * mix-blend-mode: screen blends the warm glow with the dark page below,
 * creating an ambient heat-haze illusion without displacing DOM pixels.
 * Cursor velocity drives the radius and intensity — fast moves = larger flare.
 */

import React, { useRef, useEffect } from 'react';

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision mediump float;

uniform vec2  u_mouse;      // cursor 0..1, origin top-left
uniform vec2  u_res;
uniform float u_time;
uniform float u_vel;        // normalised cursor velocity 0..1

out vec4 out_color;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.1; a*=0.5; }
  return v;
}

void main(){
  vec2 uv   = gl_FragCoord.xy / u_res;
  uv.y      = 1.0 - uv.y;

  float asp = u_res.x / u_res.y;
  vec2 d    = (uv - u_mouse) * vec2(asp, 1.0);
  float r   = 0.10 + u_vel * 0.06;
  float dst = length(d);

  float fall = pow(1.0 - smoothstep(0.0, r, dst), 2.4);

  vec2 np = uv * 11.0 + vec2(u_time*0.07, u_time*0.05);
  float n = fbm(np);

  // gilt core → ember-blood edge
  vec3 core = vec3(0.92, 0.74, 0.40);
  vec3 rim  = vec3(0.54, 0.10, 0.10);
  vec3 col  = mix(core, rim, clamp(dst/r * 1.4, 0.0, 1.0));

  float a = fall * (0.055 + n * 0.095) * (0.5 + u_vel * 0.8);
  out_color = vec4(col * a, a);
}
`;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.error('Shader error:', gl.getShaderInfoLog(s));
  return s;
}

export const HeatDistortionOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // ── Program ──────────────────────────────────────────────────────────────
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad (-1..1)
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,-1,  1,-1,  -1,1,
       1,-1,  1, 1,  -1,1,
    ]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uRes   = gl.getUniformLocation(prog, 'u_res');
    const uTime  = gl.getUniformLocation(prog, 'u_time');
    const uVel   = gl.getUniformLocation(prog, 'u_vel');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ── State ─────────────────────────────────────────────────────────────────
    let W = 0, H = 0;
    let mx = -1, my = -1, pmx = -1, pmy = -1, vel = 0;
    let rafId = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
      gl.viewport(0, 0, W, H);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', resize);
    resize();

    // ── RAF loop ──────────────────────────────────────────────────────────────
    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const t = now * 0.001;

      // velocity — lerp to zero each frame
      const dx = mx - pmx, dy = my - pmy;
      const rawVel = Math.min(Math.sqrt(dx*dx + dy*dy) * 60, 1);
      vel = vel * 0.88 + rawVel * 0.12;
      pmx = mx; pmy = my;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uVel, vel);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 60, mixBlendMode: 'screen' }}
    />
  );
};
