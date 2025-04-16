// OPTIMIZED HAUNTED HOUSE

import "./style.css";
import * as THREE from "three";
import { GUI } from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new GUI();
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog("#262837", 1, 15);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Texture loader and anisotropy
const textureLoader = new THREE.TextureLoader();
const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

function enhanceTexture(texture: THREE.Texture) {
  texture.anisotropy = maxAnisotropy;
  return texture;
}

// --- TEXTURES ---
const textures = {
  brick: {
    color: enhanceTexture(textureLoader.load("/textures/wall/color.jpg")),
    ao: enhanceTexture(textureLoader.load("/textures/wall/aoTexture.jpg")),
    normal: enhanceTexture(textureLoader.load("/textures/wall/normal.jpg")),
    roughness: enhanceTexture(
      textureLoader.load("/textures/wall/roughness.jpg")
    ),
  },
  tile: {
    color: enhanceTexture(textureLoader.load("/textures/tiles/color.jpg")),
    ao: enhanceTexture(textureLoader.load("/textures/tiles/aoTexture.jpg")),
    normal: enhanceTexture(textureLoader.load("/textures/tiles/normal.jpg")),
    roughness: enhanceTexture(
      textureLoader.load("/textures/tiles/roughness.jpg")
    ),
  },
  door: {
    color: textureLoader.load("/textures/door/color.jpg"),
    alpha: textureLoader.load("/textures/door/alpha.jpg"),
    ao: textureLoader.load("/textures/door/ambientOcclusion.jpg"),
    height: textureLoader.load("/textures/door/height.jpg"),
    normal: textureLoader.load("/textures/door/normal.jpg"),
    metalness: textureLoader.load("/textures/door/metalness.jpg"),
    roughness: textureLoader.load("/textures/door/roughness.jpg"),
  },
  floor: {
    color: enhanceTexture(textureLoader.load("/textures/floor/color.jpg")),
    ao: enhanceTexture(textureLoader.load("/textures/floor/aoTexture.jpg")),
    normal: enhanceTexture(textureLoader.load("/textures/floor/normal.jpg")),
    roughness: enhanceTexture(
      textureLoader.load("/textures/floor/roughness.jpg")
    ),
  },
};

// Repeat wrapping for floor
["color", "ao", "normal", "roughness"].forEach((key) => {
  const tex = textures.floor[key as keyof typeof textures.floor];
  tex.repeat.set(4, 4);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
});

// --- GEOMETRY HELPERS ---
function setAOMapUV(geometry: THREE.BufferGeometry) {
  geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(geometry.attributes.uv.array, 2)
  );
}

// --- HOUSE ---
const house = new THREE.Group();
scene.add(house);

// Wall
const wallGeometry = new THREE.BoxGeometry(8, 3, 4);
setAOMapUV(wallGeometry);
const wallMaterial = new THREE.MeshStandardMaterial({
  map: textures.brick.color,
  aoMap: textures.brick.ao,
  normalMap: textures.brick.normal,
  roughnessMap: textures.brick.roughness,
});
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.y = 1.5;
wall.castShadow = true;
house.add(wall);

// Towers
const towerGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
setAOMapUV(towerGeometry);
const towerMaterial = wallMaterial;

const towerPositions = [
  { x: 4, y: 2 },
  { x: -4, y: 2 },
];
towerPositions.forEach(({ x, y }) => {
  const tower = new THREE.Mesh(towerGeometry, towerMaterial);
  tower.position.set(x, y, 0);
  tower.castShadow = true;
  house.add(tower);
});

// Roofs
const roofGeometry = new THREE.ConeGeometry(2.4, 1.5, 8);
setAOMapUV(roofGeometry);
const roofMaterial = new THREE.MeshStandardMaterial({
  map: textures.tile.color,
  aoMap: textures.tile.ao,
  normalMap: textures.tile.normal,
  roughnessMap: textures.tile.roughness,
});
towerPositions.forEach(({ x }) => {
  const roof = new THREE.Mesh(roofGeometry, roofMaterial);
  roof.position.set(x, 4.7, 0);
  house.add(roof);
});

// Door
const doorGeometry = new THREE.PlaneGeometry(2.4, 2.2, 100, 100);
setAOMapUV(doorGeometry);
const doorMaterial = new THREE.MeshStandardMaterial({
  map: textures.door.color,
  transparent: true,
  alphaMap: textures.door.alpha,
  aoMap: textures.door.ao,
  displacementMap: textures.door.height,
  displacementScale: 0.1,
  normalMap: textures.door.normal,
  metalnessMap: textures.door.metalness,
  roughnessMap: textures.door.roughness,
});
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 1, 2.01);
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

[
  { s: 0.5, p: [1.1, 0.2, 2.2] },
  { s: 0.25, p: [1.7, 0.1, 2.1] },
  { s: 0.4, p: [-2.8, 0.1, 2.2] },
  { s: 0.15, p: [-3, 0.05, 2.6] },
].forEach(({ s, p }) => {
  const bush = new THREE.Mesh(bushGeometry, bushMaterial);
  bush.scale.setScalar(s);
  bush.position.set(...p);
  bush.castShadow = true;
  house.add(bush);
});

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
setAOMapUV(floorGeometry);
const floorMaterial = new THREE.MeshStandardMaterial({
  map: textures.floor.color,
  aoMap: textures.floor.ao,
  normalMap: textures.floor.normal,
  roughnessMap: textures.floor.roughness,
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI * 0.5;
floor.receiveShadow = true;
scene.add(floor);

// Graves (InstancedMesh)
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
const graveCount = 50;
const graves = new THREE.InstancedMesh(
  graveGeometry,
  graveMaterial,
  graveCount
);
scene.add(graves);

for (let i = 0; i < graveCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6.5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const y = 0.3;
  const matrix = new THREE.Matrix4().compose(
    new THREE.Vector3(x, y, z),
    new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        0,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      )
    ),
    new THREE.Vector3(1, 1, 1)
  );
  graves.setMatrixAt(i, matrix);
}

// Lights
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.5);
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001).name("Ambient");

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
scene.add(moonLight);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001).name("Moon Light");

// Ghosts
const ghostLights = [
  new THREE.PointLight("#FF00FF", 2, 3),
  new THREE.PointLight("#00ffff", 2, 3),
  new THREE.PointLight("#ffff00", 2, 3),
];
ghostLights.forEach((ghost) => {
  ghost.castShadow = true;
  ghost.shadow.mapSize.set(256, 256);
  ghost.shadow.camera.far = 7;
  scene.add(ghost);
});

// ADD this near ghost lights (below ghost3)
const lightning = new THREE.PointLight("#ffffff", 5, 15);
lightning.position.set(0, 5, 0);
lightning.intensity = 0; // Off initially
scene.add(lightning);

// ADD THIS FUNCTION after all your scene setup (before tick)
function simulateLightning() {
  const flashDuration = 100 + Math.random() * 200;

  // Random position around the house
  const radius = 5 + Math.random() * 5; // Distance from center
  const angle = Math.random() * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = 4 + Math.random() * 2; // Slight random height

  lightning.position.set(x, y, z);
  lightning.intensity = 5;

  setTimeout(() => {
    lightning.intensity = 0;
  }, flashDuration);

  // Queue next lightning
  const nextFlashDelay = 4000 + Math.random() * 5000;
  setTimeout(simulateLightning, nextFlashDelay);
}

// Camera
const sizes = { width: window.innerWidth, height: window.innerHeight };
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 4, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation
const clock = new THREE.Clock();
function tick() {
  const elapsedTime = clock.getElapsedTime();

  const [ghost1, ghost2, ghost3] = ghostLights;
  ghost1.position.set(
    Math.cos(elapsedTime * 0.5) * 4,
    Math.sin(elapsedTime * 1.5),
    Math.sin(elapsedTime * 0.5) * 4
  );
  ghost2.position.set(
    Math.cos(elapsedTime * -0.32) * 5,
    Math.sin(elapsedTime * 2.5),
    Math.sin(elapsedTime * -0.32) * 5
  );
  ghost3.position.set(
    Math.cos(elapsedTime * -0.32) * (7 + Math.sin(elapsedTime * 0.32)),
    Math.sin(elapsedTime * 2.5),
    Math.sin(elapsedTime * -0.32) * (7 + Math.sin(elapsedTime * 0.5))
  );

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

simulateLightning(); // Only call once
tick();
