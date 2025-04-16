import "./style.css";

import * as THREE from "three";
import { GUI } from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const gui = new GUI();

// Textures
const textureLoader = new THREE.TextureLoader();

// Brick Texture
const brickColor = textureLoader.load("/textures/wall/color.jpg");
const brickAoTexture = textureLoader.load("/textures/wall/aoTexture.jpg");
const brickNormal = textureLoader.load("/textures/wall/normal.jpg");
const brickRoughness = textureLoader.load("/textures/wall/roughness.jpg");

// Tiles Texture
const tileColor = textureLoader.load("/textures/tiles/color.jpg");
const tileAoTexture = textureLoader.load("/textures/tiles/aoTexture.jpg");
const tileNormal = textureLoader.load("/textures/tiles/normal.jpg");
const tileRoughness = textureLoader.load("/textures/tiles/roughness.jpg");

// Door Texture
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// Floor Texture
const floorColorTexture = textureLoader.load("/textures/floor/color.jpg");
const floorAOTexture = textureLoader.load("/textures/floor/aoTexture.jpg");
const floorNormalTexture = textureLoader.load("/textures/floor/normal.jpg");
const floorRoughnessTexture = textureLoader.load(
  "/textures/floor/roughness.jpg"
);

floorColorTexture.repeat.set(4, 4);
floorAOTexture.repeat.set(4, 4);
floorNormalTexture.repeat.set(4, 4);
floorRoughnessTexture.repeat.set(4, 4);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorAOTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorRoughnessTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorAOTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorRoughnessTexture.wrapT = THREE.RepeatWrapping;

// Scene
const scene = new THREE.Scene();

// House
const house = new THREE.Group();
scene.add(house);

// Wall
const wallGeometry = new THREE.BoxGeometry(8, 3, 4);
const wallMaterial = new THREE.MeshStandardMaterial({
  map: brickColor,
  aoMap: brickAoTexture,
  normalMap: brickNormal,
  roughnessMap: brickRoughness,
});
const wall = new THREE.Mesh(wallGeometry, wallMaterial);

wall.geometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(wall.geometry.attributes.uv.array, 2)
);
wall.position.y = 3 * 0.5;
house.add(wall);

// Tower 1
const towerGeometry = new THREE.CylinderGeometry(2, 2, 4);
const towerMaterial = new THREE.MeshStandardMaterial({
  map: brickColor,
  aoMap: brickAoTexture,
  normalMap: brickNormal,
  roughnessMap: brickRoughness,
});

const tower1 = new THREE.Mesh(towerGeometry, towerMaterial);
const tower2 = new THREE.Mesh(towerGeometry, towerMaterial);

tower1.geometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(tower1.geometry.attributes.uv.array, 2)
);
tower2.geometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(tower2.geometry.attributes.uv.array, 2)
);

tower1.position.x = 4;
tower1.position.y = 4 * 0.5;
tower2.position.x = -4;
tower2.position.y = 4 * 0.5;

house.add(tower1, tower2);

// Door
const doorGeometry = new THREE.PlaneGeometry(2.4, 2.2);
const doorMaterial = new THREE.MeshStandardMaterial({
  map: doorColorTexture,
  transparent: true,
  alphaMap: doorAlphaTexture,
  aoMap: doorAmbientOcclusionTexture,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
  normalMap: doorNormalTexture,
  metalnessMap: doorMetalnessTexture,
  roughnessMap: doorRoughnessTexture,
});

const door = new THREE.Mesh(doorGeometry, doorMaterial);

door.geometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.z = 2 + 0.01;
door.position.y = 1;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1.1, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.7, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-2.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-3, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Roof
const roofGeomtery = new THREE.ConeGeometry(2.4, 1.5, 8);
const roofMaterial = new THREE.MeshStandardMaterial({
  map: tileColor,
  aoMap: tileAoTexture,
  normalMap: tileNormal,
  roughnessMap: tileRoughness,
});

const roof1 = new THREE.Mesh(roofGeomtery, roofMaterial);
const roof2 = new THREE.Mesh(roofGeomtery, roofMaterial);

roof1.geometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(roof1.geometry.attributes.uv.array, 2)
);
roof2.geometry.setAttribute(
  "uv",
  new THREE.Float32BufferAttribute(roof2.geometry.attributes.uv.array, 2)
);

roof1.position.x = 4;
roof1.position.y = 4 + 0.7;
roof2.position.x = -4;
roof2.position.y = 4 + 0.7;

house.add(roof1, roof2);

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i <= 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6.5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  grave.position.set(x, 0.3, z);

  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

// Floor
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

// Ambient Light
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

// Ghosts
const ghost1 = new THREE.PointLight("#FF00FF", 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

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

camera.position.set(4, 4, 8);
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

// Adding fog
renderer.setClearColor("#262837");

// Shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
// doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

wall.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

floor.receiveShadow = true;

// Optimizing Shadows
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const clock = new THREE.Clock();

// Animation
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(ghost1Angle * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.32;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(ghost3Angle * 4) + Math.sin(elapsedTime * 2.5);

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
