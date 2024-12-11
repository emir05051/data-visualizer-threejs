import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import * as THREE from "three";
import { initTerrain } from "/src/terrain";

import { floodDefaultConfig, pollutionDefaultConfig } from "./configs";

let worldConfig = floodDefaultConfig;

let guiConfig = {
  showDebugger: false,
};

export function createDebugUI(scene, gui) {
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
    .onChange((scene) => {
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

  gui
    .add(sceneConfig, "currentConfig", ["flood", "pollution"])
    .onChange((config) => {
      // worldConfig
      if (config === "flood") {
        worldConfig = floodDefaultConfig;
      } else {
        worldConfig = pollutionDefaultConfig;
      }
      initTerrain(scene, worldConfig);
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

  gui.add(guiConfig, "showDebugger").onChange((state) => {
    if (state) {
      debug.show();
    } else {
      debug.hide();
    }
  });
  const debug = gui.addFolder("Debug");
  debug.hide();
  createDebugUI(scene, debug);
}

function stringToColor(hexColor) {
  return new THREE.Color(parseInt(hexColor.replace("#", ""), 16));
}
