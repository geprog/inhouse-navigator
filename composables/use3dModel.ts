import { onKeyStroke } from '@vueuse/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import LoadModelDialog from '~/components/LoadModelDialog.vue';
import NodesDialog from '~/components/NodesDialog.vue';

export default function use3dModel(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
  const currentModel = ref<THREE.Object3D>();

  const overlay = useOverlay();

  async function loadModel() {
    if (overlay.overlays.length > 0) {
      return;
    }
    
    const loadModelDialog = overlay.create(LoadModelDialog, { destroyOnClose: true });
    const instance = loadModelDialog.open();
    const fileToLoad = await instance.result;

    if (!fileToLoad) {
      return;
    }

    const loader = new GLTFLoader();
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        if (typeof reader.result === 'string') {
          loader.load(reader.result, (gltf) => {
            if (currentModel.value) {
              scene.remove(currentModel.value);
            }

            const model = gltf.scene;
            scene.add(model);
            currentModel.value = model;

            // Compute bounding box
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            const size = new THREE.Vector3();
            box.getCenter(center);
            box.getSize(size);

            // Move the camera to fit the model
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2)); // Optimal camera distance
            cameraZ *= 2.2; // Add some padding

            camera.position.set(center.x, center.y, cameraZ);
            camera.lookAt(center);
            camera.updateProjectionMatrix();
          }, undefined, (error) => {
            console.error(error);
          });
        }
      },
    );

    reader.readAsDataURL(fileToLoad);
  }

  const nodes = computed(() => {
    if (!currentModel.value) {
      return [];
    }
    const nodes: THREE.Object3D[] = [];
    currentModel.value.traverse((node) => {
      nodes.push(node);
    });
    return nodes;
  });

  function showNodes() {
    if (overlay.overlays.length > 0) {
      return;
    }
    const showNodesDialog = overlay.create(NodesDialog, { props: { nodes: nodes.value }, destroyOnClose: true });
    showNodesDialog.open()
  }

  onKeyStroke('1', () => loadModel());
  onKeyStroke('2', () => showNodes());

  return { nodes };
}
