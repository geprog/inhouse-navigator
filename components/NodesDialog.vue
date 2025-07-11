<template>
  <UModal title="Nodes of loaded model">
    <template #body>
      <ul>
        <li v-for="(node, index) of nodes" :key="index">
          {{ node.name }} - ({{ node.type }}) [{{ node.children.length }}]
          <ul>
            <li v-for="(child, childIndex) of node.children" :key="childIndex">
              {{ child.name }} - ({{ child.type }})
            </li>
          </ul>
        </li>
      </ul>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type * as THREE from 'three';

defineProps<{ nodes: THREE.Object3D[] }>();

defineEmits<{ (e: 'close'): void }>();
</script>
