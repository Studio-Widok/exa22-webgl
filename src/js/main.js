import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { InteractionManager } from 'three.interactive';

const SCALE = 0.1;

function initCamera({ renderer }) {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.y = 0.2;
  const controls = new OrbitControls(camera, renderer.domElement);

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

  return { camera, controls };
}

async function initScene() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  const { camera, controls } = initCamera({ renderer });

  const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
  );

  renderer.setAnimationLoop(() => {
    controls.update();
    interactionManager.update();
    renderer.render(scene, camera);
  });

  return { scene, camera, renderer, controls, interactionManager };
}

function loadModel() {
  return new Promise(resolve => {
    const loader = new GLTFLoader();
    loader.load('media/machine_1.glb', resolve, undefined, error => console.error(error));
  });
}

async function displayModel({ scene, interactionManager }) {
  const model = await loadModel();
  const geometry = model.scene.children[0].geometry;

  const meshMaterial = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

  const mesh = new THREE.Mesh(geometry, meshMaterial);
  mesh.scale.set(SCALE, SCALE, SCALE);
  mesh.position.y -= 0.4 * SCALE;
  scene.add(mesh);

  const edges = new THREE.EdgesGeometry(geometry);
  const edgesSegments = new THREE.LineSegments(edges, lineMaterial);
  edgesSegments.scale.set(SCALE, SCALE, SCALE);
  edgesSegments.position.y -= 0.4 * SCALE;
  scene.add(edgesSegments);

  interactionManager.add(mesh);
  mesh.addEventListener('mouseover', event => event.stopPropagation());
  mesh.addEventListener('mouseout', event => event.stopPropagation());
}

function displayDots({ scene, interactionManager }) {
  const sphereGeometry = new THREE.IcosahedronGeometry(0.02, 1);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.x = -1 * SCALE;
  sphere.position.y = (0.96667 - 0.4) * SCALE;
  sphere.position.z = -0.11667 * SCALE;
  scene.add(sphere);

  interactionManager.add(sphere);
  sphere.addEventListener('mouseover', () => {
    sphereMaterial.color.set(0xff0000);
  });
  sphere.addEventListener('mouseout', () => {
    sphereMaterial.color.set(0xffff00);
  });
}

const { scene, camera, renderer, controls, interactionManager } = await initScene();
await displayModel({ scene, interactionManager });
displayDots({ scene, interactionManager });
