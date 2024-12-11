import * as THREE from "three";
import { floodFragmentShader, floodVertexShader } from "./shaders";
let groundMesh;

export function initTerrain(scene, terrainConfig) {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const child = scene.children[i];
    if (child.isMesh) {
      scene.remove(child);
    }
  }

  let vertexShader, fragmentShader;

  if (terrainConfig.colorConfig.vertexShader === undefined) {
    vertexShader = floodVertexShader;
  } else {
    vertexShader = terrainConfig.colorConfig.vertexShader;
  }

  if (terrainConfig.colorConfig.fragmentShader === undefined) {
    fragmentShader = floodFragmentShader;
  } else {
    fragmentShader = terrainConfig.colorConfig.fragmentShader;
  }

  const plane = new THREE.PlaneGeometry(
    terrainConfig.width,
    terrainConfig.height,
    terrainConfig.segmentWidth,
    terrainConfig.segmentHeight
  );

  const disMap = new THREE.TextureLoader().load(
    "/src/" + terrainConfig.heightmap
  );

  disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;

  disMap.repeat.set(
    terrainConfig.horizontalTexture,
    terrainConfig.verticalTexture
  );

  const groundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      displacementMap: { value: disMap },
      displacementScale: { value: terrainConfig.dispScale },
      waterColor: { value: terrainConfig.colorConfig.waterColor },
      landColorLow: { value: terrainConfig.colorConfig.landColorLow },
      landColorHigh: { value: terrainConfig.colorConfig.landColorHigh },
      waterLevel: { value: terrainConfig.colorConfig.waterLevel },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    wireframe: false,
  });

  groundMesh = new THREE.Mesh(plane, groundMaterial);

  scene.add(groundMesh);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.rotation.y = -0;
}
