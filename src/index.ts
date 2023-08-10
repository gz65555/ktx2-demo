import {
  BlinnPhongMaterial,
  Camera,
  MeshRenderer,
  PrimitiveMesh,
  RenderFace,
  Texture2D,
  TextureFormat,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";
import { Pane } from "tweakpane";

const PARAMS = {
  type: "",
};

const pane = new Pane();

async function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const engine = await WebGLEngine.create({ canvas });
  engine.canvas.resizeByClientSize();
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();

  // init camera
  const cameraEntity = rootEntity.createChild("camera");
  cameraEntity.addComponent(Camera);
  const pos = cameraEntity.transform.position;
  pos.set(0, 0, 3);
  cameraEntity.transform.position = pos;
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));

  // init light
  scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
  scene.ambientLight.diffuseIntensity = 1.2;

  // init cube
  const entity = rootEntity.createChild("cube");
  const renderer = entity.addComponent(MeshRenderer);
  // renderer.
  const mtl = new BlinnPhongMaterial(engine);
  entity.transform.setRotation(90, 0, 0);
  renderer.mesh = PrimitiveMesh.createPlane(engine);
  renderer.setMaterial(mtl);
  mtl.renderFace = RenderFace.Double;

  engine.run();

  engine.resourceManager
    .load<Texture2D>("/texture2d/XDDN_LV1_01_albedo.ktx2")
    .then((tex) => {
      mtl.baseTexture = tex;

      if (tex.format === TextureFormat.ASTC_4x4) {
        PARAMS.type = "astc";
      } else if (tex.format === TextureFormat.PVRTC_RGBA4) {
        PARAMS.type = "pvrtc alpha";
      } else if (tex.format === TextureFormat.PVRTC_RGB4) {
        PARAMS.type = "pvrtc";
      } else if (tex.format === TextureFormat.ETC2_RGBA8) {
        PARAMS.type = "etc2 alpha";
      } else if (tex.format === TextureFormat.ETC2_RGB) {
        console.log("etc2");
        PARAMS.type = "etc2";
      } else if (tex.format === TextureFormat.BC1) {
        PARAMS.type = "bc1";
      } else if (tex.format === TextureFormat.BC3) {
        PARAMS.type = "bc3";
      } else {
        PARAMS.type = "unsupported";
      }
      console.log(PARAMS);
      const item = pane.addBinding(PARAMS, "type");
    });
}

init();
