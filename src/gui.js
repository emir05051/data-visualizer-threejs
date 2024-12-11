import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as THREE from "three";
import { initTerrain } from "/src/terrain";

import { pollutionFragmentShader, pollutionVertexShader } from "./shaders";

const worldConfig = {
  width: 3828,
  height: 1928,
  segmentWidth: 1000,
  segmentHeight: 1000,
  horizontalTexture: 1,
  verticalTexture: 1,
  dispScale: 80,
  heightmap: "world.png",
  colorConfig: {
    waterColor: new THREE.Color(0x005493),
    landColorLow: new THREE.Color(0x22dd22),
    landColorHigh: new THREE.Color(0xff0000),
    waterLevel: 0.0,
  },
};
export function createDebugUI(scene) {
  const gui = new GUI({ title: "Debug" });
  gui
    .add(worldConfig, "segmentWidth", 1, 3000)
    .step(1)
    .onChange(() => {
      initTerrain(scene, worldConfig);
    });

  gui
    .add(worldConfig, "segmentHeight", 1, 3000)
    .step(1)
    .onChange(() => {
      initTerrain(scene, worldConfig);
    });

  gui
    .add(worldConfig, "horizontalTexture", 1, 10)
    .step(1)
    .onChange(() => {
      initTerrain(scene, worldConfig);
    });

  gui
    .add(worldConfig, "verticalTexture", 1, 10)
    .step(1)
    .onChange(() => {
      initTerrain(scene, worldConfig);
    });

  gui
    .add(worldConfig, "dispScale", 0, 100)
    .step(1)
    .onChange(() => {
      initTerrain(scene, worldConfig);
    });
  gui
    .add(worldConfig, "heightmap", [
      "heightmap.png",
      "heightmap2.png",
      "heightmap3.png",
      "heightmap4.png",
      "heightmap5.png",
      "world.png",
    ])
    .onChange(() => {
      initTerrain(scene, worldConfig);
    });
}

export function createNormalUI(scene) {
  const gui = new GUI({ title: "User" });

  const sceneConfig = {
    currentConfig: "flood",
    waterColor: "#005493",
    landColorLow: "#22dd22",
    landColorHigh: "#ff0000",
    waterLevel: 0,
  };

  gui.add(sceneConfig, "currentConfig", ["flood", "pollution"]).onChange(() => {
    // worldConfig
    console.log(sceneConfig);
    console.log(worldConfig);
  });

  const colorFolder = gui.addFolder("Change colors");

  colorFolder.add(sceneConfig, "waterColor").onChange(() => {
    worldConfig.colorConfig.waterColor = stringToColor(sceneConfig.waterColor);
    initTerrain(scene, worldConfig);
  });
  colorFolder.add(sceneConfig, "landColorLow").onChange(() => {
    worldConfig.colorConfig.landColorLow = stringToColor(
      sceneConfig.landColorLow
    );
    initTerrain(scene, worldConfig);
  });
  colorFolder.add(sceneConfig, "landColorHigh").onChange(() => {
    worldConfig.colorConfig.landColorHigh = stringToColor(
      sceneConfig.landColorHigh
    );
    initTerrain(scene, worldConfig);
  });

  gui
    .add(sceneConfig, "waterLevel", 0, 1)
    .step(0.01)
    .onChange(() => {
      worldConfig.colorConfig.waterLevel = sceneConfig.waterLevel;
      initTerrain(scene, worldConfig);
    });
}

function stringToColor(hexColor) {
  return new THREE.Color(parseInt(hexColor.replace("#", ""), 16));
}
