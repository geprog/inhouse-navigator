import { useWindowSize } from '@vueuse/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export default function () {
  const { width, height } = useWindowSize();
  const container = useTemplateRef<HTMLDivElement>('container');

  const camera = new THREE.PerspectiveCamera(70, width.value / height.value, 0.1, 1000);
  camera.position.z = 1;

  const scene = new THREE.Scene();

  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
  scene.add(ambientLight);

  // Directional light for shadows and directional lighting
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  // Orbit controls setup
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Smooth interaction
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1;
  controls.maxDistance = 500;
  controls.target.set(0, 0, 0); // Point camera looks at initially
  controls.update(); // Required if controls.target has changed

  // register helpers

  // Updating loop
  function animate() {
    controls.update(); // Only if enableDamping = true
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);

  watch([width, height], () => {
    renderer.setSize(width.value, height.value);
  }, { immediate: true });

  watch(container, () => {
    if (container.value) {
      container.value.appendChild(renderer.domElement);
    }
  }, { immediate: true });

  return { scene, camera };
}
