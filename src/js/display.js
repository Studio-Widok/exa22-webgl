import * as THREE from 'three';
import { LineSegments2, LineSegmentsGeometry } from "three/examples/jsm/Addons.js";
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { loadModel } from "./init";
import { dots, settings } from "./settings";

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
    color: settings.colors.line,
    linewidth: 1.5,
    worldUnits: false,
    alphaToCoverage: true,
  });

  for (let i = 0; i < model.scene.children.length; i++) {
    const geometry = model.scene.children[i].geometry;
    const edges = new THREE.EdgesGeometry(geometry, settings.minEdgeAngle);

    let selectableMaterial;
    for (let j = 0; j < dots.length; j++) {
      const dot = dots[j];

      if (dot.elements.includes(model.scene.children[i].name)) {
        dot.meshMaterial = new THREE.MeshBasicMaterial({
          color: settings.colors.bg,
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
    mesh.scale.set(settings.scale, settings.scale, settings.scale);
    scene.add(mesh);

    interactionManager.add(mesh);
    mesh.addEventListener('mouseover', event => event.stopPropagation());
    mesh.addEventListener('mouseout', event => event.stopPropagation());
    mesh.addEventListener('click', event => event.stopPropagation());

    const lineSegmentsGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges);
    const lineSegments2 = new LineSegments2(lineSegmentsGeometry, lineMaterial);
    lineSegments2.scale.set(settings.scale, settings.scale, settings.scale);
    scene.add(lineSegments2);
  }

  return;
}

const dotDescriptions = Array.from(document.getElementsByClassName('dot'));
Array.from(document.getElementsByClassName('dot-title')).forEach(title => {
  title.addEventListener('click', () => {
    showDescription(parseInt(title.dataset['index']));
  });
});
let dotTimeout;

function showDescription(index) {
  dots[index].isActive = true;
  dots[index].meshMaterial.color.set(settings.colors.elementActive);

  const descElement = dotDescriptions[index].getElementsByClassName('dot-description')[0];
  descElement.style.height = descElement.scrollHeight + 'px';
  dotTimeout = setTimeout(() => descElement.style.height = 'auto', 300);

  for (let i = 0; i < dotDescriptions.length; i++) {
    if (i === index) continue;
    hideDescription(i);
  }
}

function hideDescription(index) {
  dots[index].isActive = false;
  dots[index].meshMaterial.color.set(settings.colors.bg);

  const descElement = dotDescriptions[index].getElementsByClassName('dot-description')[0];
  descElement.style.height = descElement.scrollHeight + 'px';
  clearTimeout(dotTimeout);
  setTimeout(() => descElement.style.height = 0, 0);
}

function displayDots({ scene, interactionManager }) {
  const labelClickElement = document.getElementById('labels-info');
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];

    const sphereGeometry = new THREE.IcosahedronGeometry(settings.dotSize * settings.scale, 2);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: settings.colors.dot });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = dot.position.x * settings.scale;
    sphere.position.y = dot.position.y * settings.scale;
    sphere.position.z = dot.position.z * settings.scale;
    scene.add(sphere);

    interactionManager.add(sphere);
    sphere.addEventListener('mouseover', () => {
      sphereMaterial.color.set(settings.colors.dotHover);
      dot.meshMaterial.color.set(settings.colors.elementHover);
      settings.container.classList.add('hovered');
      labelClickElement.classList.add('visible');
      labelClickElement.textContent = dot.label;
    });
    sphere.addEventListener('mouseout', () => {
      sphereMaterial.color.set(settings.colors.dot);
      if (!dot.isActive) dot.meshMaterial.color.set(settings.colors.bg);
      settings.container.classList.remove('hovered');
      labelClickElement.classList.remove('visible');
      labelClickElement.textContent = '';
    });
    sphere.addEventListener('click', () => {
      if (dot.isActive) hideDescription(i);
      else showDescription(i);
    });
  }
}

async function display({ dots, scene, interactionManager }) {
  await displayModel({ dots, scene, interactionManager });
  displayDots({ dots, scene, interactionManager });
}

export default display;
