import { initScene } from "./init";
import display from "./display";

const { scene, interactionManager } = await initScene();
display({ scene, interactionManager });
