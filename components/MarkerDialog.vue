<template>
  <USlideover title="Update marker" :overlay="false">
    <template #body>
      <UFormField label="X">
        <UInput v-model="coordinate.x" type="number" step="0.1" />
      </UFormField>
      <UFormField label="Y">
        <UInput v-model="coordinate.y" type="number" step="0.1" />
      </UFormField>
      <UFormField label="Z">
        <UInput v-model="coordinate.z" type="number" step="0.1" />
      </UFormField>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
type Coordinate = { x: number, y: number, z: number };
defineModel<Coordinate>('coordinate', { required: true });
</script>
