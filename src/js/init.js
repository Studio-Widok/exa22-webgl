import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { InteractionManager } from 'three.interactive';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { settings } from "./settings";

function initCamera({ renderer }) {
  const camera = new THREE.PerspectiveCamera(50, settings.viewAspect, 0.01, 1000);
  camera.position.z = -5;
  camera.position.y = 2;
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.25;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.minDistance = 2.5;
  controls.maxDistance = 2.5;
  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.5;

  let autoRotateTimeout;
  controls.addEventListener('start', function () {
    clearTimeout(autoRotateTimeout);
    controls.autoRotate = false;
  });

  // controls.addEventListener('end', function () {
  //   autoRotateTimeout = setTimeout(function () {
  //     controls.autoRotate = true;
  //   }, settings.autoRotateInterval);
  // });

  window.addEventListener('resize', onWindowResize);
  function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(settings.container.clientWidth, settings.container.clientWidth / settings.viewAspect);
  }

  return { camera, controls };
}

async function initScene() {
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    settings.container.clientWidth,
    settings.container.clientWidth / settings.viewAspect
  );
  document.getElementById('model').appendChild(renderer.domElement);
  const { camera, controls } = initCamera({ renderer });

  const interactionManager = new InteractionManager(
    renderer,
    camera,
    renderer.domElement
  );

  return { scene, camera, renderer, controls, interactionManager };
}

function loadModel() {
  return new Promise(resolve => {
    const loader = new GLTFLoader();
    loader.load('media/machine_1.glb', resolve, undefined, error => console.error(error));
  });
}

export {
  initScene,
  loadModel,
};
