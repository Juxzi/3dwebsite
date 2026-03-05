"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    // ── Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    camera.position.set(0, 0, 4);
    camera.fov = 55;
    camera.updateProjectionMatrix();

    // ── Lumières style lumière naturelle / soleil ─────────

    // Ciel — lumière ambiante douce hémisphérique
    // Simule la lumière diffuse du ciel (bleu/vert doux) + sol (terre chaude)
    const hemiLight = new THREE.HemisphereLight(
      0xd4ecd4,  // ciel — vert très pâle, lumière forêt
      0x6b4c2a,  // sol  — brun terre chaud
      0.9
    );
    scene.add(hemiLight);

    // Soleil principal — lumière directionnelle chaude (heure dorée)
    const sunLight = new THREE.DirectionalLight(0xfff4d6, 2.2);
    sunLight.position.set(5, 8, 3);   // angle haut-droit, comme soleil matinal
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far  = 20;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Lumière de remplissage — ombre côté gauche adoucie (ciel bleu indirect)
    const fillLight = new THREE.DirectionalLight(0xc8d8f0, 0.5);
    fillLight.position.set(-4, 2, -2);
    scene.add(fillLight);

    // Contre-jour subtil — donne du volume par derrière (soleil à travers les feuilles)
    const rimLight = new THREE.DirectionalLight(0xffe8a0, 0.7);
    rimLight.position.set(-1, 4, -5);
    scene.add(rimLight);

    // Active le tone mapping pour rendu plus naturel
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ── Groupe ────────────────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    // ── Particules flottantes ─────────────────────────────
    const particleCount = 100;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 6;
      pos[i*3+1] = (Math.random() - 0.5) * 6;
      pos[i*3+2] = (Math.random() - 0.5) * 4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const particles = new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0xB1B695, size: 0.022, transparent: true, opacity: 0.45 })
    );
    scene.add(particles);

    // ── Loader GLB ────────────────────────────────────────
    const loader = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;

    loader.load(
      "/models/deer.glb",
      (gltf) => {
        const model = gltf.scene;

        // Centrer et scaler automatiquement
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / maxDim;

        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        // Activer ombres et normaliser les matériaux pour la lumière
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow    = true;
            mesh.receiveShadow = true;
            // Si le GLB n'a pas de matériaux, on lui en donne un naturel
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.envMapIntensity = 0.8;
                m.needsUpdate     = true;
              }
            });
          }
        });

        group.add(model);

        // Animations GLB si présentes
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
        }
      },
      undefined,
      (err) => console.warn("GLB not found, check /public/models/deer.glb", err)
    );

    // ── Souris ────────────────────────────────────────────
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2.0;
      targetY = ((e.clientY - rect.top)   / rect.height - 0.5) * 1.2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Loop ──────────────────────────────────────────────
    let frame: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t     = clock.getElapsedTime();

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      group.rotation.y = currentX * 0.55 + Math.sin(t * 0.25) * 0.04;
      group.rotation.x = -currentY * 0.3;
      group.position.y = Math.sin(t * 0.5) * 0.06;

      particles.rotation.y = t * 0.03;

      mixer?.update(delta);
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────
    const onResize = () => {
      const W2 = el.clientWidth, H2 = el.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

      return (
    <div ref={mountRef} className="w-full h-full" style={{ minHeight: "100vh" }} />
  );
}