import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { initTerrain } from "/src/terrain.js";
import { createDebugUI, createNormalUI } from "/src/gui.js";

import { defaultConfig } from "./configs";

export let camera;
export let scene;
export let renderer;
export let controls;

init();
animate();

function init() {
  // INIT SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHex(0xffcddb);

  // INIT RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // INIT CAMERA
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(0, 500, 500);
  camera.lookAt(0, 0, 0);

  // INIT CONTROLS
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  controls.enablePan = true;
  controls.minDistance = 300;
  controls.maxDistance = 1000;

  // Light

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
  scene.add(ambientLight);

  initTerrain(scene, defaultConfig);

  // UI
  // createDebugUI(scene);
  createNormalUI(scene);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
