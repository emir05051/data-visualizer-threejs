import * as THREE from "three";

import {
  floodFragmentShader,
  floodVertexShader,
  pollutionFragmentShader,
  pollutionVertexShader,
} from "./shaders";

const mapWidth = 3828;
const mapHeight = 1928;

export const floodDefaultConfig = {
  name: "flood",
  width: mapWidth,
  height: mapHeight,
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
  vertexShader: floodVertexShader,
  fragmentShader: floodFragmentShader,
};

export const pollutionDefaultConfig = {
  name: "pollution",
  width: mapWidth,
  height: mapHeight,
  segmentWidth: 1000,
  segmentHeight: 1000,
  horizontalTexture: 1,
  verticalTexture: 1,
  dispScale: 5,
  heightmap: "world.png",
  colorConfig: {
    waterColor: new THREE.Color(0x1029259),
    landColorLow: new THREE.Color(0x1029259),
    landColorHigh: new THREE.Color(0x1029259),
    waterLevel: 0.0,
  },
  vertexShader: floodVertexShader,
  fragmentShader: floodFragmentShader,
  floodTerrain: {
    vertexShader: pollutionVertexShader,
    fragmentShader: pollutionFragmentShader,
  },
};

export const defaultConfig = pollutionDefaultConfig;
