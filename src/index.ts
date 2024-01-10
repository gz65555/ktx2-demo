/**
 * @title Primitive Mesh
 * @category Mesh
 */
import { OrbitControl } from "@galacean/engine-toolkit-controls";
import {
  AssetType,
  BlinnPhongMaterial,
  Camera,
  Color,
  DirectLight,
  Entity,
  Material,
  MeshRenderer,
  ModelMesh,
  PrimitiveMesh,
  RenderFace,
  Script,
  Vector3,
  WebGLEngine,
} from "@galacean/engine";

main();

async function main(): Promise<void> {
  // Create engine
  const engine = await WebGLEngine.create({ canvas: "canvas" });
  engine.canvas.resizeByClientSize();

  // Create root entity
  const scene = engine.sceneManager.activeScene;
  const rootEntity = scene.createRootEntity();
  scene.ambientLight.diffuseSolidColor = new Color(0.6, 0.6, 0.6);

  // Create camera
  const cameraEntity = rootEntity.createChild("Camera");
  cameraEntity.transform.setPosition(0, 0, 20);
  cameraEntity.addComponent(Camera);
  cameraEntity.addComponent(OrbitControl);

  // Create direct light
  const lightEntity = rootEntity.createChild("DirectLight");
  const light = lightEntity.addComponent(DirectLight);
  light.intensity = 0.6;

  engine.resourceManager
    .load([
      {
        url: "/texture2d/DuckCM-web.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/DuckCM.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/huopen_Normal.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/huopen_Roughness.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/jpg-file.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/KVImage-uint8.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/XDDN_LV1_01_albedo.ktx2",
        type: AssetType.KTX2,
      },
      {
        url: "/texture2d/photo-min.ktx2",
        type: AssetType.KTX2,
      },
    ])
    .then((textures) => {
      const distanceX = 2.5;
      const distanceY = 2.4;
      const position = new Vector3();

      // Create material
      let materials = [];
      for (let n = 0; n < 8; n++) {
        const material = new BlinnPhongMaterial(engine);
        material.renderFace = RenderFace.Double;
        material.baseTexture = textures[n];
        materials.push(material);
      }

      for (let i = 0; i < 3; i++) {
        const posX = (i - 1) * distanceX;
        let specialMaterial = undefined;
        if(i == 2){
          specialMaterial = materials[7];
        }else{
          specialMaterial = undefined;
        }

        // Create cuboid
        position.set(posX, distanceY * 3, 0);
        generatePrimitiveEntity(
          rootEntity,
          "cuboid",
          position,
          specialMaterial || materials[0],
          PrimitiveMesh.createCuboid(engine)
        );

        // Create sphere
        position.set(posX, distanceY * 2, 0);
        generatePrimitiveEntity(
          rootEntity,
          "sphere",
          position,
          specialMaterial || materials[1],
          PrimitiveMesh.createSphere(engine)
        );

        // Create plane
        position.set(posX, distanceY * 1, 0);
        generatePrimitiveEntity(
          rootEntity,
          "plane",
          position,
          specialMaterial || materials[2],
          PrimitiveMesh.createPlane(engine)
        );

        // Create cylinder
        position.set(posX, -distanceY * 0, 0);
        generatePrimitiveEntity(
          rootEntity,
          "cylinder",
          position,
          specialMaterial || materials[3],
          PrimitiveMesh.createCylinder(engine)
        );

        // Create cone
        position.set(posX, -distanceY * 1, 0);
        generatePrimitiveEntity(
          rootEntity,
          "cone",
          position,
          specialMaterial || materials[4],
          PrimitiveMesh.createCone(engine)
        );

        // Create turos
        position.set(posX, -distanceY * 2, 0);
        generatePrimitiveEntity(
          rootEntity,
          "torus",
          position,
          specialMaterial || materials[5],
          PrimitiveMesh.createTorus(engine)
        );

        // Create capsule
        position.set(posX, -distanceY * 3, 0);
        generatePrimitiveEntity(
          rootEntity,
          "capsule",
          position,
          specialMaterial || materials[6],
          PrimitiveMesh.createCapsule(engine, 0.5, 1, 24, 1)
        );
      }
    });

  // Run engine
  engine.run();
}

/**
 * generate primitive mesh entity.
 */
function generatePrimitiveEntity(
  rootEntity: Entity,
  name: string,
  position: Vector3,
  material: Material,
  mesh: ModelMesh
): Entity {
  const entity = rootEntity.createChild(name);
  entity.transform.setPosition(position.x, position.y, position.z);
  entity.addComponent(RotateScript);
  const renderer = entity.addComponent(MeshRenderer);
  renderer.mesh = mesh;
  renderer.setMaterial(material);

  return entity;
}

/**
 * Script for rotate.
 */
class RotateScript extends Script {
  /**
   * @override
   * The main loop, called frame by frame.
   * @param deltaTime - The deltaTime when the script update.
   */
  onUpdate(deltaTime: number): void {
    this.entity.transform.rotate(0.5, 0.6, 0);
  }
}