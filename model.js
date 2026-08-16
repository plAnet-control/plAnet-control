import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('aCanvas');
const container = document.getElementById('aModel');

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const scene = new THREE.Scene();

// Environment for realistic metallic reflections
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const key = new THREE.DirectionalLight(0xffffff, 1.7);
key.position.set(60, 80, 100);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffffff, 0.6);
rim.position.set(-80, -40, 60);
scene.add(rim);

scene.add(new THREE.AmbientLight(0xffffff, 0.25));

let mesh;
let camera;
// Vertical frustum is fixed (baseline pinned at y=0); horizontal adapts to container aspect.
const frustum = { halfWidth: 30, top: 55 };

function buildCamera() {
  const w = container.clientWidth || 1;
  const h = container.clientHeight || 1;
  const containerAspect = w / h;

  const top = frustum.top;
  const bottom = 0; // the letter's bottom sits exactly here, matching the text baseline
  const vertRange = top - bottom;
  const halfWidth = Math.max(frustum.halfWidth, (vertRange * containerAspect) / 2);

  camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, top, bottom, -200, 200);
  camera.position.set(0, 0, 100);
  camera.lookAt(0, 0, 0);
}

function resize() {
  const w = container.clientWidth || 1;
  const h = container.clientHeight || 1;
  renderer.setSize(w, h, false);
  buildCamera();
}

const loader = new STLLoader();
loader.load('./A_sketch_no_holes.stl', (geometry) => {
  // Model's extrusion (thin) axis came in along X, height along Z, width along Y.
  // Rotate so width->X, height->Y, depth->Z, matching three.js's Y-up/Z-forward convention.
  geometry.rotateX(-Math.PI / 2);
  geometry.rotateY(-Math.PI / 2);
  geometry.computeBoundingBox();

  // Center horizontally/depth-wise, but pin the bottom to y=0 so it sits on
  // the same baseline as the surrounding letters instead of floating mid-box.
  let box = geometry.boundingBox;
  const centerX = (box.min.x + box.max.x) / 2;
  const centerZ = (box.min.z + box.max.z) / 2;
  geometry.translate(-centerX, -box.min.y, -centerZ);
  geometry.computeBoundingBox();
  geometry.computeVertexNormals();

  box = geometry.boundingBox;
  const height = box.max.y - box.min.y;
  const width = Math.max(Math.abs(box.min.x), Math.abs(box.max.x)) * 2;
  const depth = Math.max(Math.abs(box.min.z), Math.abs(box.max.z)) * 2;
  const maxApparentWidth = Math.sqrt(width * width + depth * depth);

  frustum.top = height * 1.08;
  frustum.halfWidth = (maxApparentWidth / 2) * 1.15;

  const material = new THREE.MeshStandardMaterial({
    color: 0xf2f2f2,
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1.7,
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  resize();
  animate();
});

window.addEventListener('resize', resize);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mesh) {
    // Reversed spin direction, per request — always rotates, never flickers.
    mesh.rotation.y -= delta * 0.35;
  }
  renderer.render(scene, camera);
}
