import * as THREE from "three";
import { createPollutionMap, fetchPollutionData } from "./pollution";

let groundMesh;
let fetchedPollutionData;

export function initTerrain(scene, terrainConfig) {
  scene.children
    .filter((child) => child.isMesh)
    .forEach((child) => scene.remove(child));

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

  let groundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      displacementMap: { value: disMap },
      displacementScale: { value: terrainConfig.dispScale },
      waterColor: { value: terrainConfig.colorConfig.waterColor },
      landColorLow: { value: terrainConfig.colorConfig.landColorLow },
      landColorHigh: { value: terrainConfig.colorConfig.landColorHigh },
      waterLevel: { value: terrainConfig.colorConfig.waterLevel },
    },
    vertexShader: terrainConfig.vertexShader,
    fragmentShader: terrainConfig.fragmentShader,
    wireframe: false,
  });

  groundMesh = new THREE.Mesh(plane, groundMaterial);
  scene.add(groundMesh);
  groundMesh.rotation.x = -Math.PI / 2;

  if (terrainConfig.name === "pollution") {
    if (fetchedPollutionData === undefined) {
      fetchPollutionData().then((pollutionData) => {
        const pollutionMap = createPollutionMap(
          pollutionData,
          terrainConfig.width,
          terrainConfig.height
        );

        addPolutionOverlay(scene, groundMesh, pollutionMap);
      });
    }
  }
}

function addPolutionOverlay(scene, terrain, pollutionMap) {
  const pollutionMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pollutionMap: { value: pollutionMap },
      elevationScale: { value: 20.0 },
    },
    vertexShader: `
      uniform sampler2D pollutionMap; 
      uniform float elevationScale;   

      varying vec2 vUv;               

      void main() {
        vUv = uv;
        float pollutionLevel = texture2D(pollutionMap, uv).r;
        float elevation = pollutionLevel > 0.25 ? pollutionLevel * elevationScale : 0.0;
        vec3 displacedPosition = position + normal * elevation;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D pollutionMap;

    varying vec2 vUv;
    varying float pollutionLevel;

    void main() {
      float pollutionLevel = clamp(texture2D(pollutionMap, vUv).r, 0.0, 1.0);

      vec3 color;
      if (pollutionLevel < 0.25) {
        color = mix(vec3(0.05, 0.55, 0.45), vec3(1.0, 1.0, 0.0), pollutionLevel * 4.0); // Green to Yellow
      } else if (pollutionLevel < 0.5) {
        color = mix(vec3(1.0, 1.0, 0.0), vec3(0.7, 0.1, 0.1), (pollutionLevel - 0.25) * 4.0); // Yellow to Red
      } else {
        color = mix(vec3(0.7, 0.1, 0.1), vec3(0.4, 0.0, 0.8), (pollutionLevel - 0.5) * 4.0); // Red to Purple
      }

      gl_FragColor = vec4(color, 1.0);
    }
    `,
    transparent: false,
  });
  const pollutionMesh = new THREE.Mesh(
    terrain.geometry.clone(),
    pollutionMaterial
  );
  scene.add(pollutionMesh);
  pollutionMesh.rotation.x = -Math.PI / 2;
}
