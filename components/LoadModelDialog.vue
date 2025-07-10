<template>
  <UModal title="Load 3D model">
    <template #body>
      <UInput type="file" @change="selectFile" />
    </template>

    <template #footer>
      <UButton label="Cancel" color="neutral" variant="outline" @click="$emit('close', undefined)" />
      <UButton label="Load" color="neutral" :disabled="!modelFile" @click="emit('close', modelFile)" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'close', file?: File): void }>();

const modelFile = defineModel<File>();

function selectFile(event: { target: HTMLInputElement }) {
  const files = event.target.files;
  if (files?.length) {
    modelFile.value = files[0];
  }
}
</script>
