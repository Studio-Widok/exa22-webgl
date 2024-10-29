import { initScene } from "./init";
import display from "./display";

const { scene, camera, renderer, controls, interactionManager } = await initScene();

renderer.setAnimationLoop((time) => {
  controls.update();
  interactionManager.update();
  renderer.render(scene, camera);
});

display({ scene, interactionManager });
