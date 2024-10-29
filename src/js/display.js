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
    });
    sphere.addEventListener('mouseout', () => {
      sphereMaterial.color.set(settings.colors.dot);
      if (!dot.isActive) dot.meshMaterial.color.set(settings.colors.bg);
      settings.container.classList.remove('hovered');
    });
    sphere.addEventListener('click', () => {
      dot.meshMaterial.color.set(settings.colors.elementActive);
      dot.isActive = true;
      for (let j = 0; j < dots.length; j++) {
        if (dot.index === dots[j].index) continue;

        dots[j].isActive = false;
        dots[j].meshMaterial.color.set(settings.colors.bg);
      }
      showDescription(i);
    });
  }
}

async function display({ dots, scene, interactionManager }) {
  await displayModel({ dots, scene, interactionManager });
  displayDots({ dots, scene, interactionManager });
}

export default display;
