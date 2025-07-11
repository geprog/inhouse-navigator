<template>
  <div ref="container" class="h-screen w-screen" />
</template>

<script setup lang="ts">
const { scene, camera } = useScene();
const { nodes, currentModel, currentNavMesh } = use3dModel(scene, camera);
const { currentCoordinate, path, start, end, targetCoordinate, navMesh } = useMarker(scene, currentNavMesh);
</script>
