import * as THREE from 'three';
import { threeToSoloNavMesh, NavMeshHelper } from '@recast-navigation/three';
import { init } from 'recast-navigation';

let recastReady = ref(false);
async function initRecast() {
  await init();
  recastReady.value = true;
  console.log("Recast is ready");
}

void initRecast();

export default function useNavMesh(scene: THREE.Scene) {
  if (!recastReady.value) {
    return undefined;
  }

  /* get meshes to generate the navmesh from */
  const meshes: THREE.Mesh[] = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child);
    }
  });

  /* generate a solo navmesh */
  const { success, navMesh } = threeToSoloNavMesh(meshes, {
    
  });

  if (!success || !navMesh) {
    return undefined;
  }

  const navMeshHelper = new NavMeshHelper(navMesh);
  scene.add(navMeshHelper);

  return navMesh;
}
