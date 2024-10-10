import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { InteractionManager } from 'three.interactive';
import { INTERSECTION, Brush, Evaluator } from 'three-bvh-csg';

const SCALE = 0.1;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();
loader.load('media/machine_1.glb', function (gltf) {
  console.log(gltf.scene);

  const geometry = gltf.scene.children[0].geometry;
  const edges = new THREE.EdgesGeometry(geometry);

  const brush1 = new Brush(new THREE.SphereGeometry(0.5));
  brush1.updateMatrixWorld();

  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const wireFrame = new THREE.LineSegments(edges, material);
  wireFrame.scale.set(SCALE, SCALE, SCALE);
  wireFrame.position.y -= 0.4 * SCALE;

  const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee, side: THREE.DoubleSide });
  const geometryBrush = new Brush(geometry, meshMaterial);
  geometryBrush.updateMatrixWorld();
  const evaluator = new Evaluator();
  const result = evaluator.evaluate(brush1, geometryBrush, INTERSECTION);
  result.scale.set(SCALE, SCALE, SCALE);

  scene.add(result);

  // const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
  // const mesh = new THREE.Mesh(result, meshMaterial);
  // mesh.scale.set(SCALE, SCALE, SCALE);
  // mesh.position.y -= 0.4 * SCALE;
  // scene.add(mesh);
  // interactionManager.add(mesh);
  // mesh.addEventListener('mouseover', event => event.stopPropagation());
  // mesh.addEventListener('mouseout', event => event.stopPropagation());

  function animate() {
    controls.update();
    interactionManager.update();
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}, undefined, function (error) {
  console.error(error);
});

const sphereGeometry = new THREE.IcosahedronGeometry(0.02, 1);
const meshMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
scene.add(sphere);
sphere.position.x = -1 * SCALE;
sphere.position.y = (0.96667 - 0.4) * SCALE;
sphere.position.z = -0.11667 * SCALE;

camera.position.x = 0;
camera.position.y = 0.2;
camera.position.z = 0;

let controls;
controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0.2;
controls.maxDistance = 1;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 4 * 3;

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const interactionManager = new InteractionManager(
  renderer,
  camera,
  renderer.domElement
);

interactionManager.add(sphere);
sphere.addEventListener('mouseover', () => {
  meshMaterial.color.set(0xff0000);
});
sphere.addEventListener('mouseout', () => {
  meshMaterial.color.set(0xffff00);
});
