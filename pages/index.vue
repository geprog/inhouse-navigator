<template>
  <div ref="container" class="h-screen w-screen" />

  <UModal v-model:open="loadModelDialog" title="Load 3D model">
    <template #body>
      <UInput type="file" @change="handleFileUpload" />
    </template>

    <template #footer="{ close }">
      <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
      <UButton label="Submit" color="neutral" :disabled="!modelFile" @click="loadModel" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { onKeyStroke, useWindowSize } from '@vueuse/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const { width, height } = useWindowSize();
const container = useTemplateRef<HTMLDivElement>('container');
// init

const camera = new THREE.PerspectiveCamera(70, width.value / height.value, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new THREE.WebGLRenderer({ antialias: true });

watch([width, height], () => {
  renderer.setSize(width.value, height.value);
  renderer.render(scene, camera);
}, { immediate: true });

watch(container, () => {
  if (container.value) {
    container.value.appendChild(renderer.domElement);
  }
}, { immediate: true });

const loadModelDialog = ref(false);
const modelFile = defineModel<File>();

function handleFileUpload(event: { target: HTMLInputElement }) {
  const files = event.target.files;
  if (files?.length) {
    modelFile.value = files[0];
  }
}

function loadModel() {
  if (!modelFile.value) {
    return;
  }
  const loader = new GLTFLoader();
  const reader = new FileReader();

  reader.addEventListener(
    'load',
    () => {
      if (typeof reader.result === 'string') {
        loader.load(reader.result, (gltf) => {
          scene.clear();
          scene.add(gltf.scene);
          renderer.render(scene, camera);
          loadModelDialog.value = false;
          modelFile.value = undefined;
        }, undefined, (error) => {
          console.error(error);
        });
      }
    },
  );

  reader.readAsDataURL(modelFile.value);
}

onKeyStroke('Shift', () => loadModelDialog.value = true);
</script>
