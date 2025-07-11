import { onKeyStroke } from '@vueuse/core';
import { NavMesh, NavMeshQuery } from 'recast-navigation';
import * as THREE from 'three';
import { Pathfinding } from 'three-pathfinding';
import { color } from 'three/tsl';
import MarkerDialog from '~/components/MarkerDialog.vue';

export default function (scene: THREE.Scene, navMesh?: Ref<NavMesh | undefined>) {
  const currentCoordinate = ref<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
  const targetCoordinate = ref<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });

  const coordinateMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0, 1), new THREE.MeshNormalMaterial({ colorNode: color(0x0000ff) }));
  scene.add(coordinateMarker);

  const targetMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0, 1), new THREE.MeshNormalMaterial({ colorNode: color(0xff0000) }));
  scene.add(targetMarker);

  watch(currentCoordinate, () => {
    const { x, y, z } = currentCoordinate.value;
    coordinateMarker.position.set(x, y, z);
  }, { deep: true });

  watch(targetCoordinate, () => {
    const { x, y, z } = targetCoordinate.value;
    targetMarker.position.set(x, y, z);
  }, { deep: true });

  const overlay = useOverlay();

  async function changeCoordinate() {
    if (overlay.overlays.length > 0) {
      return;
    }
    const showNodesDialog = overlay.create(MarkerDialog, { props: { start: currentCoordinate.value, target: targetCoordinate.value }, destroyOnClose: true });
    const instance = showNodesDialog.open()
    const newCoordinate = await instance.result;
    if (newCoordinate) {
      currentCoordinate.value = newCoordinate;
    }
  }

  onKeyStroke('3', () => changeCoordinate());

  const pathGeometry = new THREE.BufferGeometry().setFromPoints([]);
  const line = new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ color: 0xff0000 }));
  scene.add(line);

  const path = computed(() => {
    if (!navMesh || !navMesh.value) {
      return [];
    }
    debugger;
    const navMeshQuery = new NavMeshQuery(navMesh.value);
    const { success, error, path } = navMeshQuery.computePath(currentCoordinate.value, targetCoordinate.value);
    if (!success || !path) {
      return [];
    }
    return path.map(({ x, y, z }) => new THREE.Vector3(x, y, z));
    // const pathfinder = new Pathfinding();
    // const ZONE = 'mesh_0';
    // const zoneData = Pathfinding.createZone(navMesh.);
    // pathfinder.setZoneData(ZONE, navMesh);

    // const groupID = pathfinder.getGroup(ZONE, start);
    // return pathfinder.findPath(start, currentCoordinate.value, ZONE, groupID);
  });

  watch(path, () => {
    pathGeometry.setFromPoints(path.value);
  }, { immediate: true });

  return { currentCoordinate, path, navMesh };
}
