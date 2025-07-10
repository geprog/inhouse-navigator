import { onKeyStroke } from '@vueuse/core';
import * as THREE from 'three';
import MarkerDialog from '~/components/MarkerDialog.vue';

export default function (scene: THREE.Scene) {
  const currentCoordinate = ref<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });

  const coordinateMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0, 1), new THREE.MeshNormalMaterial());
  scene.add(coordinateMarker);

  watch(currentCoordinate, () => {
    const { x, y, z } = currentCoordinate.value;
    coordinateMarker.position.set(x, y, z);
  }, { deep: true });

  const overlay = useOverlay();

  async function changeCoordinate() {
    if (overlay.overlays.length > 0) {
      return;
    }
    const showNodesDialog = overlay.create(MarkerDialog, { props: { coordinate: currentCoordinate.value, }, destroyOnClose: true });
    const instance = showNodesDialog.open()
    const newCoordinate = await instance.result;
    if (newCoordinate) {
      currentCoordinate.value = newCoordinate;
    }
  }

  onKeyStroke('3', () => changeCoordinate());

  return { currentCoordinate };
}
