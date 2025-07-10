<template>
  <div ref="container" class="h-screen w-screen" />
</template>

<script setup lang="ts">
const { scene, camera } = useScene();
const { nodes } = use3dModel(scene, camera);
const { currentCoordinate } = useMarker(scene);
</script>
