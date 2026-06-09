/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChronicleScene — Three.js soul-constellation background for the Timeline.
 *
 * One glowing soul-shard per timeline entry, connected by dim golden chains.
 * Ambient ember-specks drift upward through the void. Mouse movement tilts
 * the scene for a 3D parallax feel. Hovering a DOM entry brightens and
 * enlarges the corresponding shard.
 *
 * Three is dynamically imported so it doesn't bloat the main bundle.
 */

import React, { useRef, useEffect } from 'react';

interface ChronicleSceneProps {
  entryCount: number;
  hoveredIndex: number | null;
}

export const ChronicleScene: React.FC<ChronicleSceneProps> = ({
  entryCount,
  hoveredIndex,
}) => {
  const mountRef  = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<number | null>(null);

  // Mirror prop into ref so RAF loop reads current value without
  // re-running the heavy setup effect.
  useEffect(() => {
    hoveredRef.current = hoveredIndex;
  }, [hoveredIndex]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let raf = 0;
    let disposeAll: (() => void) | null = null;

    import('three').then((THREE) => {
      const N = entryCount;

      // ── Renderer ─────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const resize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      mount.appendChild(renderer.domElement);

      // ── Scene / Camera ────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x07070a, 0.09);

      const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 60);
      camera.position.set(0, 0, 8);

      // ── Lights ────────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x0d0d14, 4));

      const warmLight = new THREE.PointLight(0xb8935a, 6, 25);
      warmLight.position.set(3, 4, 6);
      scene.add(warmLight);

      const coolLight = new THREE.PointLight(0x8b1a1a, 4, 20);
      coolLight.position.set(-3, -3, 4);
      scene.add(coolLight);

      // ── Soul shards (low-poly icosahedra per entry) ───────────────────────
      const shardGeo = new THREE.IcosahedronGeometry(0.11, 1);
      const shards: THREE.Mesh[] = [];
      const shardBaseY: number[] = [];
      const shardPhase: number[] = [];

      // Recent entry = gilt, oldest = dark coal-red
      const colorRecent = new THREE.Color(0xb8935a);
      const colorOld    = new THREE.Color(0x5c1a1a);

      // A faint wisp halo ring behind each shard
      const haloGeo  = new THREE.RingGeometry(0.18, 0.22, 32);
      const haloes: THREE.Mesh[] = [];

      for (let i = 0; i < N; i++) {
        const t   = i / Math.max(N - 1, 1);
        const col = colorRecent.clone().lerp(colorOld, t);

        const mat = new THREE.MeshStandardMaterial({
          color:             col.clone().multiplyScalar(0.5),
          emissive:          col,
          emissiveIntensity: 1.4,
          roughness:         0.25,
          metalness:         0.15,
          transparent:       true,
          opacity:           0.92,
        });

        const shard = new THREE.Mesh(shardGeo, mat);
        const isLeft = i % 2 === 0;
        const baseY  = (N - 1) / 2 - i; // even spread: top to bottom
        const baseX  = isLeft ? -1.3 : 1.3;
        const baseZ  = (Math.random() - 0.5) * 0.9;

        shard.position.set(baseX, baseY, baseZ);
        shard.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        );

        shardBaseY.push(baseY);
        shardPhase.push(Math.random() * Math.PI * 2);
        shards.push(shard);
        scene.add(shard);

        // Halo ring — billboards toward camera; updated in loop
        const haloMat = new THREE.MeshBasicMaterial({
          color:       col,
          transparent: true,
          opacity:     0.10,
          side:        THREE.DoubleSide,
          depthWrite:  false,
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(shard.position);
        haloes.push(halo);
        scene.add(halo);
      }

      // ── Connection chains (LineSegments, updated each frame) ──────────────
      const chainPositions = new Float32Array((N - 1) * 6);
      const chainGeo = new THREE.BufferGeometry();
      chainGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(chainPositions, 3),
      );
      const chainMat = new THREE.LineBasicMaterial({
        color:       0xb8935a,
        transparent: true,
        opacity:     0.20,
      });
      scene.add(new THREE.LineSegments(chainGeo, chainMat));

      // ── Ambient ember specks (Points) ─────────────────────────────────────
      const NPARTS = 200;
      const pPos  = new Float32Array(NPARTS * 3);
      const pVel  = new Float32Array(NPARTS * 3); // x, y, phase-offset

      for (let i = 0; i < NPARTS; i++) {
        pPos[i*3]     = (Math.random() - 0.5) * 7;
        pPos[i*3 + 1] = (Math.random() - 0.5) * 9;
        pPos[i*3 + 2] = (Math.random() - 0.5) * 4;
        pVel[i*3]     = (Math.random() - 0.5) * 0.0015;
        pVel[i*3 + 1] = 0.003 + Math.random() * 0.004;
        pVel[i*3 + 2] = Math.random() * Math.PI * 2; // phase
      }
      const pGeo  = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat  = new THREE.PointsMaterial({
        color:          0xb8935a,
        size:           0.022,
        transparent:    true,
        opacity:        0.45,
        sizeAttenuation: true,
        depthWrite:     false,
      });
      scene.add(new THREE.Points(pGeo, pMat));

      // ── Mouse parallax ────────────────────────────────────────────────────
      let tgtRotX = 0, tgtRotY = 0;
      const onMouseMove = (e: MouseEvent) => {
        tgtRotY = ((e.clientX / window.innerWidth)  - 0.5) *  0.30;
        tgtRotX = ((e.clientY / window.innerHeight) - 0.5) * -0.18;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('resize', resize);
      resize();

      // ── RAF loop ──────────────────────────────────────────────────────────
      let elapsed = 0;
      let last = performance.now();

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        elapsed += dt;

        // Scene parallax
        scene.rotation.y += (tgtRotY - scene.rotation.y) * 0.035;
        scene.rotation.x += (tgtRotX - scene.rotation.x) * 0.035;

        const hIdx = hoveredRef.current;

        for (let i = 0; i < N; i++) {
          const shard = shards[i];
          const mat   = shard.material as THREE.MeshStandardMaterial;

          // Float — unique freq and amplitude per shard
          shard.position.y = shardBaseY[i]
            + Math.sin(elapsed * 0.38 + shardPhase[i]) * 0.09;

          // Slow rotation
          shard.rotation.y += dt * 0.18;
          shard.rotation.x += dt * 0.09;

          // Hover glow
          const isHovered = hIdx === i;
          const tgtIntensity = isHovered ? 4.0 : 1.4;
          const tgtScale     = isHovered ? 1.55 : 1.0;
          mat.emissiveIntensity += (tgtIntensity - mat.emissiveIntensity) * 0.08;
          shard.scale.x += (tgtScale - shard.scale.x) * 0.08;
          shard.scale.y = shard.scale.z = shard.scale.x;

          // Halo tracks shard + slow pulse
          const halo    = haloes[i];
          halo.position.copy(shard.position);
          halo.lookAt(camera.position);
          const tgtHaloOpacity = isHovered ? 0.35 : 0.10;
          (halo.material as THREE.MeshBasicMaterial).opacity +=
            (tgtHaloOpacity - (halo.material as THREE.MeshBasicMaterial).opacity) * 0.08;
          halo.scale.setScalar(
            1 + Math.sin(elapsed * 1.1 + shardPhase[i]) * 0.08,
          );

          // Update chain endpoint
          if (i < N - 1) {
            const a = shard.position;
            const b = shards[i + 1].position;
            chainPositions[i*6]     = a.x;
            chainPositions[i*6 + 1] = a.y;
            chainPositions[i*6 + 2] = a.z;
            chainPositions[i*6 + 3] = b.x;
            chainPositions[i*6 + 4] = b.y;
            chainPositions[i*6 + 5] = b.z;
          }
        }
        chainGeo.attributes.position.needsUpdate = true;

        // Drift particles upward, wrap at top
        for (let i = 0; i < NPARTS; i++) {
          pPos[i*3]     += pVel[i*3];
          pPos[i*3 + 1] += pVel[i*3 + 1];
          if (pPos[i*3 + 1] > 5.5) {
            pPos[i*3 + 1] = -5.5;
            pPos[i*3]     = (Math.random() - 0.5) * 7;
          }
        }
        pGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      raf = requestAnimationFrame(tick);

      disposeAll = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', resize);
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
        renderer.dispose();
        shardGeo.dispose();
        haloGeo.dispose();
        chainGeo.dispose();
        chainMat.dispose();
        pGeo.dispose();
        pMat.dispose();
        shards.forEach(s => (s.material as THREE.Material).dispose());
        haloes.forEach(h => (h.material as THREE.Material).dispose());
      };
    });

    return () => {
      if (disposeAll) disposeAll();
      else cancelAnimationFrame(raf);
    };
  }, [entryCount]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};
