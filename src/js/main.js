import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { LineSegments2, LineSegmentsGeometry, OrbitControls } from "three/examples/jsm/Addons.js";
import { InteractionManager } from 'three.interactive';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const SCALE = 1.1;
const VIEW_ASPECT = 4 / 3;
const container = document.getElementById('model');
const minEdgeAngle = 12;
const dotSize = 0.03;
const colors = {
  bg: 0x000000,
  line: 0xffffff,
  dot: 0xffdd00,
  dotHover: 0xee3300,
  elementHover: 0x444444,
  elementActive: 0x333333,
};

const dots = [
  {
    position: {
      x: -0.75,
      y: 0.63,
      z: -0.2,
    },
    elements: ['dot_1'],
  },
  {
    position: {
      x: 0.65,
      y: 0.32,
      z: -0.25,
    },
    elements: ['dot_2'],
  },
  {
    position: {
      x: 0.15,
      y: 0.17,
      z: -0.2,
    },
    elements: ['dot_3'],
  },
  {
    position: {
      x: -0.2,
      y: 0.12,
      z: -0.05,
    },
    elements: ['dot_4'],
  },
];

for (let i = 0; i < dots.length; i++) dots[i].index = i;

function initCamera({ renderer }) {
  const camera = new THREE.PerspectiveCamera(50, VIEW_ASPECT, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.minDistance = 2.5;
  controls.maxDistance = 2.5;
  controls.minPolarAngle = Math.PI * 0.35;
  controls.maxPolarAngle = Math.PI * 0.35;

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
  renderer.setClearColor(colors.bg);
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

  const meshMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const lineMaterial = new LineMaterial({
    color: colors.line,
    linewidth: 1.5,
    worldUnits: false,
    alphaToCoverage: true,
  });

  for (let i = 0; i < model.scene.children.length; i++) {
    const geometry = model.scene.children[i].geometry;
    const edges = new THREE.EdgesGeometry(geometry, minEdgeAngle);

    let selectableMaterial;
    for (let j = 0; j < dots.length; j++) {
      const dot = dots[j];

      if (dot.elements.includes(model.scene.children[i].name)) {
        dot.meshMaterial = new THREE.MeshBasicMaterial({
          color: colors.bg,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        });
        selectableMaterial = dot.meshMaterial;
        break;
      }
    }

    const mesh = new THREE.Mesh(geometry, selectableMaterial ?? meshMaterial);
    mesh.scale.set(SCALE, SCALE, SCALE);
    scene.add(mesh);

    interactionManager.add(mesh);
    mesh.addEventListener('mouseover', event => event.stopPropagation());
    mesh.addEventListener('mouseout', event => event.stopPropagation());
    mesh.addEventListener('click', event => event.stopPropagation());

    const lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
    const lineSegments2 = new LineSegments2(lineSegmentsGeometry, lineMaterial);
    lineSegments2.scale.set(SCALE, SCALE, SCALE);
    scene.add(lineSegments2);
  }

  return;
}

const dotDescriptionsWrap = document.getElementById('desc');
const dotDescriptions = Array.from(document.getElementsByClassName('dot-description'));
let dotTimeout;
function showDescription(index) {
  dotDescriptionsWrap.append(dotDescriptions[index]);

  dotDescriptions[index].style.height = dotDescriptions[index].scrollHeight + 'px';
  dotTimeout = setTimeout(() => dotDescriptions[index].style.height = 'auto', 300);

  for (let i = 0; i < dotDescriptions.length; i++) {
    if (i === index) continue;

    dotDescriptions[i].style.height = dotDescriptions[i].scrollHeight + 'px';
    clearTimeout(dotTimeout);
    setTimeout(() => dotDescriptions[i].style.height = 0, 0);
  }
}

function displayDots({ scene, interactionManager }) {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];

    const sphereGeometry = new THREE.IcosahedronGeometry(dotSize * SCALE, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: colors.dot });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = dot.position.x * SCALE;
    sphere.position.y = dot.position.y * SCALE;
    sphere.position.z = dot.position.z * SCALE;
    scene.add(sphere);

    interactionManager.add(sphere);
    sphere.addEventListener('mouseover', () => {
      sphereMaterial.color.set(colors.dotHover);
      dot.meshMaterial.color.set(colors.elementHover);
      container.classList.add('hovered');
    });
    sphere.addEventListener('mouseout', () => {
      sphereMaterial.color.set(colors.dot);
      if (!dot.isActive) dot.meshMaterial.color.set(colors.bg);
      container.classList.remove('hovered');
    });
    sphere.addEventListener('click', () => {
      dot.meshMaterial.color.set(colors.elementActive);
      dot.isActive = true;
      for (let j = 0; j < dots.length; j++) {
        if (dot.index === dots[j].index) continue;

        dots[j].isActive = false;
        dots[j].meshMaterial.color.set(colors.bg);
      }
      showDescription(i);
    });
  }
}

const { scene, camera, renderer, controls, interactionManager } = await initScene();
await displayModel({ scene, interactionManager });
displayDots({ scene, interactionManager });
