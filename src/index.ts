import {
  BlinnPhongMaterial,
  Camera,
  Logger,
  MeshRenderer,
  PrimitiveMesh,
  Texture2D,
  Vector3,
  WebGLEngine,
  WebGLMode,
} from "@galacean/engine";

Logger.enable();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const engine = await WebGLEngine.create({ canvas });
engine.canvas.resizeByClientSize();
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// init camera
const cameraEntity = rootEntity.createChild("camera");
cameraEntity.addComponent(Camera);
const pos = cameraEntity.transform.position;
pos.set(5, 5, 5);
cameraEntity.transform.position = pos;
cameraEntity.transform.lookAt(new Vector3(0, 0, 0));

// init light
scene.ambientLight.diffuseSolidColor.set(1, 1, 1, 1);
scene.ambientLight.diffuseIntensity = 1.2;

// init cube
const cubeEntity = rootEntity.createChild("cube");
const renderer = cubeEntity.addComponent(MeshRenderer);
const mtl = new BlinnPhongMaterial(engine);
renderer.mesh = PrimitiveMesh.createCuboid(engine);
renderer.setMaterial(mtl);

engine.run();

// https://mdn.alipayobjects.com/rms/afts/file/A*0jiKRK6D1-kAAAAAAAAAAAAAARQnAQ/uastc_astc.wasm
// https://mdn.alipayobjects.com/rms/afts/file/A*88bRR6-GF7oAAAAAAAAAAAAAARQnAQ/basis_transcoder.wasm

async function testLoader() {
  engine.resourceManager.load<Texture2D>("/DuckCM.ktx2").then((res) => {
    console.log("result", res);
    mtl.baseTexture = res;
  });
  // const ktx2Loader = new KTX2Loader(false);
  // ktx2Loader
  //   .load({ url:  }, engine.resourceManager)
  //   .then((result) => {
  //   });
}

testLoader();
