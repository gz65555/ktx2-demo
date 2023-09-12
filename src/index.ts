import {
  AssetType,
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
import ssim from "ssim.js";

const PARAMS = {
  type: "",
};

const pane = new Pane();

async function init() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2");
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
    .load([
      {
        url: 'https://gw.alipayobjects.com/zos/OasisHub/267000040/4580/DuckCM.png',
        type: AssetType.Texture2D,
      },
      {
        url: 'https://mdn.alipayobjects.com/rms/afts/img/A*Ju7pS4AAX_AAAAAAAAAAAAAAARQnAQ/original/DuckCM.ktx2',
        type: AssetType.KTX2,
      }
    ])
    .then((textures) => {
      const png = textures[0];
      const ktx2 = textures[1];
      mtl.baseTexture = ktx2;

      if (ktx2.format === TextureFormat.ASTC_4x4) {
        PARAMS.type = "astc";
      } else if (ktx2.format === TextureFormat.PVRTC_RGBA4) {
        PARAMS.type = "pvrtc alpha";
      } else if (ktx2.format === TextureFormat.PVRTC_RGB4) {
        PARAMS.type = "pvrtc";
      } else if (ktx2.format === TextureFormat.ETC2_RGBA8) {
        PARAMS.type = "etc2 alpha";
      } else if (ktx2.format === TextureFormat.ETC2_RGB) {
        console.log("etc2");
        PARAMS.type = "etc2";
      } else if (ktx2.format === TextureFormat.BC1) {
        PARAMS.type = "bc1";
      } else if (ktx2.format === TextureFormat.BC3) {
        PARAMS.type = "bc3";
      } else {
        PARAMS.type = "unsupported";
      }
      console.log(PARAMS);
      const item = pane.addBinding(PARAMS, "type");

      const pngBuffer = new Uint8Array(png.width * png.height * 4);
      png.getPixelBuffer(pngBuffer);
      console.log('pngBuffer = ', pngBuffer);

      const ktx2buffer = new Uint8Array(
        gl.drawingBufferWidth * gl.drawingBufferHeight * 4,
      );
      gl.readPixels(
        0,
        0,
        ktx2.width,
        ktx2.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        ktx2buffer,
      );
      console.log('ktx2buffer = ',ktx2buffer); // Uint8Array

      const imageDataPNG = {
        data: pngBuffer,
        height: 512,
        width: 512
      }

      const imageDataKTX2 = {
        data: ktx2buffer,
        height: ktx2.width,
        width: ktx2.height
      }

      const { mssim, performance } = ssim(imageDataPNG, imageDataKTX2);
      console.log(`SSIM: ${mssim} (${performance}ms)`);
    });
}

init();
