<template>
  <USlideover title="Update marker" :overlay="false">
    <template #body>
      <UCard>
        <template #header>Start coordinate (blue marker)</template>
        <UFormField label="X">
          <UInput v-model="start.x" type="number" step="0.1" />
        </UFormField>
        <UFormField label="Y">
          <UInput v-model="start.y" type="number" step="0.1" />
        </UFormField>
        <UFormField label="Z">
          <UInput v-model="start.z" type="number" step="0.1" />
        </UFormField>
      </UCard>
      <UCard>
        <template #header>Target coordinate (red marker)</template>
        <UFormField label="X">
          <UInput v-model="target.x" type="number" step="0.1" />
        </UFormField>
        <UFormField label="Y">
          <UInput v-model="target.y" type="number" step="0.1" />
        </UFormField>
        <UFormField label="Z">
          <UInput v-model="target.z" type="number" step="0.1" />
        </UFormField>
      </UCard>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
type Coordinate = { x: number, y: number, z: number };
defineModel<Coordinate>('start', { required: true });
defineModel<Coordinate>('target', { required: true });
</script>
