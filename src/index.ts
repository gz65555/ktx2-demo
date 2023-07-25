import {
  AssetType,
  BackgroundMode,
  BlinnPhongMaterial,
  Camera,
  GLTFResource,
  Logger,
  MeshRenderer,
  PrimitiveMesh,
  SkyBoxMaterial,
  Texture2D,
  TextureCube,
  TextureFormat,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";

Logger.enable();

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
  pos.set(5, 5, 5);
  cameraEntity.transform.position = pos;
  cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
  // cameraEntity.addComponent(OrbitControl);

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
    engine.resourceManager.load<Texture2D>("/jpg-file.ktx2").then((tex) => {
      mtl.baseTexture = tex;
      if (tex.format === TextureFormat.ASTC_4x4) {
        console.log("astc");
      } else if (tex.format === TextureFormat.PVRTC_RGBA4) {
        console.log("pvrtc alpha");
      } else if (tex.format === TextureFormat.PVRTC_RGB4) {
        console.log("pvrtc");
      } else if (tex.format === TextureFormat.ETC2_RGBA8) {
        console.log("etc2 alpha");
      } else if (tex.format === TextureFormat.ETC2_RGB) {
        console.log("etc2");
      } else if (tex.format === TextureFormat.DXT5) {
        console.log("dxt5");
      } else if (tex.format === TextureFormat.DXT1) {
        console.log("dxt1");
      }
    });

    // await KTX2Loader.init(engine);

    engine.resourceManager
      .load<TextureCube>("/skybox-zstd.ktx2")
      .then((cubeTex) => {
        // console.log(cubeTex);
        scene.background.mode = BackgroundMode.Sky;
        const skyMaterial = (scene.background.sky.material = new SkyBoxMaterial(
          engine
        )) as SkyBoxMaterial;
        skyMaterial.texture = cubeTex; // 设置立方体纹理
        scene.background.sky.mesh = PrimitiveMesh.createCuboid(engine, 2, 2, 2); // 设置天空盒网格
      })
      .catch((e) => {
        console.log(e);
      });

    engine.resourceManager
      .load<GLTFResource>("/gltf/duck-basisu.gltf")
      .then((gltf) => {
        gltf.defaultSceneRoot.transform.setPosition(2, -1, 0);
        rootEntity.addChild(gltf.defaultSceneRoot);
      });

    engine.resourceManager
      .load<GLTFResource>("/gltf/duck-basisu.glb")
      .then((gltf) => {
        gltf.defaultSceneRoot.transform.setPosition(-2, -1, 0);
        rootEntity.addChild(gltf.defaultSceneRoot);
      });
  }

  testLoader();
}

init();
