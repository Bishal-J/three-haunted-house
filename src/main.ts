import "./style.css";

import * as THREE from "three";
import { GUI } from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const gui = new GUI();

// Textures
const textureLoader = new THREE.TextureLoader();

const floorColorTexture = textureLoader.load("/textures/rocky-floor/color.jpg");
const floorAOTexture = textureLoader.load(
  "/textures/rocky-floor/aoTexture.jpg"
);
const floorNormalTexture = textureLoader.load(
  "/textures/rocky-floor/normal.jpg"
);
const floorRoughnessTexture = textureLoader.load(
  "/textures/rocky-floor/roughness.jpg"
);

// Scene
const scene = new THREE.Scene();

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: floorColorTexture,
  aoMap: floorAOTexture,
  normalMap: floorNormalTexture,
  roughnessMap: floorRoughnessTexture,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);

floor.geometry.setAttribute(
  "uv",
  new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

// Lights
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.5);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Ambient Light");
scene.add(ambientLight);

// Directional Light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001).name("Moon Light");
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.set(4, 2, 5);
scene.add(camera);

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// Resising
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

// Animation
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
