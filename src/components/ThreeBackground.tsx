"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    // Animasi gradient gelombang vertikal ke atas, looping
    float wave = sin(uTime * 1.2 + vUv.x * 8.0) * 0.15;
    float grad = smoothstep(0.0, 1.0, vUv.x + wave + sin(uTime) * 0.2);
    vec3 color = mix(vec3(0.07), vec3(1.0), grad);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 0, 1000);
    camera.lookAt(0, 0, 0);

    // Gradient background plane - much larger for all screen sizes
    let planeGeo = new THREE.PlaneGeometry(8000, 4000);
    const uniforms = {
      uTime: { value: 0 }
    };
    const planeMat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.position.set(0, 0, 0);
    scene.add(plane);

    // Parameters for particles
    const SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 30;
    let particles: THREE.Points;
    let count = 0;

    // Geometry & Material for particles
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    let i = 0, j = 0;
    const yOffset = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
        positions[i + 1] = yOffset;
        positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
        // Black to white gradient looping
        const gradient = ((ix / AMOUNTX + iy / AMOUNTY) / 2 + count * 0.02) % 1.0;
        const grayValue = gradient;
        colors[i] = grayValue;
        colors[i + 1] = grayValue;
        colors[i + 2] = grayValue;
        i += 3;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ 
      size: 16, 
      vertexColors: true, 
      color: 0xffffff,
      transparent: true,
      opacity: 0.4
    });
    particles = new THREE.Points(geometry, material);
    particles.rotation.x = -Math.PI / 1.2;
    scene.add(particles);

    // Responsive
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      // Keep camera position consistent for 2D effect
      camera.position.set(0, 0, 1000);
      camera.lookAt(0, 0, 0);
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      let positions = geometry.attributes.position as THREE.BufferAttribute;
      let colorsAttr = geometry.attributes.color as THREE.BufferAttribute;
      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          positions.setY(i / 3, (Math.sin((ix + count) * 0.3) * 50) + (Math.sin((iy + count) * 0.5) * 50));
          // Animasi warna: black to white gradient looping
          const gradient = ((ix / AMOUNTX + iy / AMOUNTY) / 2 + count * 0.02) % 1.0;
          const grayValue = gradient;
          colorsAttr.setX(i / 3, grayValue);
          colorsAttr.setY(i / 3, grayValue);
          colorsAttr.setZ(i / 3, grayValue);
          i += 3;
        }
      }
      positions.needsUpdate = true;
      colorsAttr.needsUpdate = true;
      particles.rotation.y = Math.sin(count * 0.02) * 0.2;
      count += 0.1;
      // Animasi gradient background
      uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    />
  );
}
