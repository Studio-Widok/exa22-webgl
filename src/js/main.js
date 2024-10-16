import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LineSegments2, LineSegmentsGeometry, OrbitControls } from "three/examples/jsm/Addons.js";
import { InteractionManager } from 'three.interactive';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const SCALE = 1;
const VIEW_ASPECT = 4 / 3;
const container = document.getElementById('model');
const bgColor = 0x111111;

function initCamera({ renderer }) {
  const camera = new THREE.PerspectiveCamera(60, VIEW_ASPECT, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.minDistance = 2;
  controls.maxDistance = 2;
  controls.minPolarAngle = Math.PI * 0.4;
  controls.maxPolarAngle = Math.PI * 0.4;

  window.addEventListener('resize', onWindowResize);
  function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientWidth / VIEW_ASPECT);
  }

  return { camera, controls };
}

async function initScene() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(bgColor);
  renderer.setSize(container.clientWidth, container.clientWidth / VIEW_ASPECT);
  document.getElementById('model').appendChild(renderer.domElement);
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

  const meshMaterial = new THREE.MeshBasicMaterial({ color: bgColor, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const lineMaterial = new LineMaterial({
    color: 0xffffff,
    linewidth: 2,
    worldUnits: false,
    alphaToCoverage: true,
  });

  for (let i = 0; i < model.scene.children.length; i++) {
    const geometry = model.scene.children[i].geometry;
    const edges = new THREE.EdgesGeometry(geometry, 23);

    const mesh = new THREE.Mesh(geometry, meshMaterial);
    mesh.scale.set(SCALE, SCALE, SCALE);
    mesh.position.y -= 0.4 * SCALE;
    scene.add(mesh);

    interactionManager.add(mesh);
    mesh.addEventListener('mouseover', event => event.stopPropagation());
    mesh.addEventListener('mouseout', event => event.stopPropagation());

    const lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
    const lineSegments2 = new LineSegments2(lineSegmentsGeometry, lineMaterial);
    lineSegments2.scale.set(SCALE, SCALE, SCALE);
    lineSegments2.position.y -= 0.4 * SCALE;
    scene.add(lineSegments2);
  }

  return;
}

function displayDots({ scene, interactionManager }) {
  const sphereGeometry = new THREE.IcosahedronGeometry(0.05 * SCALE, 2);
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
