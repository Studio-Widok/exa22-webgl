import * as THREE from 'three';
import { LineSegments2, LineSegmentsGeometry } from "three/examples/jsm/Addons.js";
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { loadModel } from "./init";
import { dots, settings } from "./settings";
import { dotClick, dotMouseOut, dotMouseOver } from "./descriptions";

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

function displayDots({ scene, interactionManager }) {
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];

    const sphereGeometry = new THREE.IcosahedronGeometry(settings.dotSize * settings.scale, 2);
    dot.sphereMaterial = new THREE.MeshBasicMaterial({ color: settings.colors.dot });
    const sphere = new THREE.Mesh(sphereGeometry, dot.sphereMaterial);
    sphere.position.x = dot.position.x * settings.scale;
    sphere.position.y = dot.position.y * settings.scale;
    sphere.position.z = dot.position.z * settings.scale;
    scene.add(sphere);

    interactionManager.add(sphere);
    sphere.addEventListener('mouseover', () => dotMouseOver(dot));
    sphere.addEventListener('mouseout', () => dotMouseOut(dot));
    sphere.addEventListener('click', () => dotClick(dot));
  }
}

async function display({ dots, scene, interactionManager }) {
  await displayModel({ dots, scene, interactionManager });
  displayDots({ dots, scene, interactionManager });
}

export default display;
