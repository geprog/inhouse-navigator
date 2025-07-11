import { onKeyStroke } from '@vueuse/core';
import { NavMesh, NavMeshQuery } from 'recast-navigation';
import * as THREE from 'three';
import { Pathfinding } from 'three-pathfinding';
import { color } from 'three/tsl';
import MarkerDialog from '~/components/MarkerDialog.vue';

export default function (scene: THREE.Scene, navMesh?: Ref<NavMesh | undefined>) {
  const currentCoordinate = ref<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
  const targetCoordinate = ref<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });

  const coordinateMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0, 1), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  scene.add(coordinateMarker);

  const targetMarker = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0, 1), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  scene.add(targetMarker);

  watch(currentCoordinate, () => {
    const { x, y, z } = currentCoordinate.value;
    coordinateMarker.position.set(x, y, z);
  }, { deep: true });

  watch(targetCoordinate, () => {
    const { x, y, z } = targetCoordinate.value;
    targetMarker.position.set(x, y, z);
  }, { deep: true });

  const pathGeometry = new THREE.BufferGeometry().setFromPoints([]);
  const pathLine = new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 }));
  scene.add(pathLine);

  function getPointOnNavMesh(coordinate: { x: number, y: number; z: number }) {
    if (!navMesh || !navMesh.value) {
      return undefined;
    }
    const navMeshQuery = new NavMeshQuery(navMesh.value);
    const { success, status, point, polyRef, isPointOverPoly } =
      navMeshQuery.findClosestPoint(coordinate);
    console.log('Point on nav mesh result', success, status, point, polyRef, isPointOverPoly);
    if (success && point) {
      return point;
    }
    return undefined;
  }
  const start = computed(() => getPointOnNavMesh(currentCoordinate.value));
  const end = computed(() => getPointOnNavMesh(targetCoordinate.value));

  const startMarker = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshLambertMaterial({ color: 0x0000ff }));
  scene.add(startMarker);

  const endMarker = new THREE.Mesh(new THREE.SphereGeometry(0.5), new THREE.MeshLambertMaterial({ color: 0xff0000 }));
  scene.add(endMarker);

  watch(start, () => {
    if (start.value) {
      const { x, y, z } = start.value;
      startMarker.position.set(x, y, z);
    }
  }, { deep: true });

  watch(end, () => {
    if (end.value) {
      const { x, y, z } = end.value;
      endMarker.position.set(x, y, z);
    }
  }, { deep: true });

  const path = computed(() => {
    if (!navMesh || !navMesh.value) {
      return [];
    }
    if (!start.value || !end.value) {
      return [];
    }

    const navMeshQuery = new NavMeshQuery(navMesh.value);
    const { success, error, path } = navMeshQuery.computePath(start.value, end.value);
    console.log('path finding result', success, error);
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
    debugger;
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.value);
    pathLine.geometry = pathGeometry;
  }, { deep: true, immediate: true });


  const overlay = useOverlay();

  async function changeCoordinate() {
    if (overlay.overlays.length > 0) {
      return;
    }
    const showNodesDialog = overlay.create(MarkerDialog, { props: { start: currentCoordinate.value, target: targetCoordinate.value, path: path.value }, destroyOnClose: true });
    const instance = showNodesDialog.open()
    const newCoordinate = await instance.result;
    if (newCoordinate) {
      currentCoordinate.value = newCoordinate;
    }
  }

  onKeyStroke('3', () => changeCoordinate());

  return { currentCoordinate, targetCoordinate, path, navMesh, start, end };
}
