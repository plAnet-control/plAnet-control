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
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
camera.position.set(0, 0, 140);

// Environment for realistic metallic reflections
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Fill lights for extra highlight movement as it rotates
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(60, 80, 100);
scene.add(key);

const rim = new THREE.DirectionalLight(0xffffff, 0.6);
rim.position.set(-80, -40, 60);
scene.add(rim);

scene.add(new THREE.AmbientLight(0xffffff, 0.25));

let mesh;

function resize() {
  const w = container.clientWidth || 1;
  const h = container.clientHeight || 1;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const loader = new STLLoader();
loader.load('./A_sketch_no_holes.stl', (geometry) => {
  geometry.center();

  // Model's extrusion (thin) axis came in along X, height along Z, width along Y.
  // Rotate so width->X, height->Y, depth->Z, matching three.js's Y-up/Z-forward convention.
  geometry.rotateX(-Math.PI / 2);
  geometry.rotateY(-Math.PI / 2);

  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.3,
    side: THREE.DoubleSide,
  });

  mesh = new THREE.Mesh(geometry, material);

  // Scale to fit the canvas nicely
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);
  // Use the diagonal (not just maxDim) so the model doesn't clip the canvas
  // edges as it spins and presents a wider silhouette at intermediate angles.
  const diagonal = Math.sqrt(size.x * size.x + size.z * size.z);
  const scale = 54 / Math.max(diagonal, size.y);
  mesh.scale.setScalar(scale);

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
    // Slow, continuous rotation — this never pauses or flickers.
    mesh.rotation.y += delta * 0.35;
  }
  renderer.render(scene, camera);
}
