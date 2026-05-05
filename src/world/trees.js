import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js"

const TREES_PATH = "/models/assets/trees_final.glb"

const gltfLoader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("/draco/")
gltfLoader.setDRACOLoader(dracoLoader)

export const loadTrees = (scene) => {
  gltfLoader.load(
    TREES_PATH,
    (gltf) => {
      const treesPack = gltf.scene

      const tree01Source = treesPack.getObjectByName("Tree_01")
      const tree02Source = treesPack.getObjectByName("Tree_02")
      const tree03Source = treesPack.getObjectByName("Tree_03")
      const tree04Source = treesPack.getObjectByName("Tree_04")
      const tree05Source = treesPack.getObjectByName("Tree_05")
      const tree06Source = treesPack.getObjectByName("Tree_06")
      const tree07Source = treesPack.getObjectByName("Tree_07")
      const tree08Source = treesPack.getObjectByName("Tree_08")

      // Picnic
      const treeA = tree01Source.clone(true)
      treeA.position.set(-10, -2, -36)
      treeA.rotation.y = Math.PI * 0.2
      treeA.scale.setScalar(3)

      // Balais kiki
      const treeB = tree08Source.clone(true)
      treeB.position.set(-11, 0, -25)
      treeB.rotation.y = Math.PI * 0
      treeB.scale.setScalar(1)

      // Laputa
      const treeC = tree03Source.clone(true)
      treeC.position.set(-10, -6, -20)
      treeC.rotation.y = Math.PI * 0.5
      treeC.scale.setScalar(3)

      // Plus a gauche
      const treeD = tree06Source.clone(true)
      treeD.position.set(-20, 0, -20)
      treeD.rotation.y = Math.PI * 0.5
      treeD.scale.setScalar(2)

      // Plus a gauche - buisson
      const treeE = tree08Source.clone(true)
      treeE.position.set(-20, -5, -20)
      treeE.rotation.y = Math.PI * 0.5
      treeE.scale.setScalar(0.5)

      // totoro - buisson
      const treeF = tree08Source.clone(true)
      treeF.position.set(-16, -5, -35)
      treeF.rotation.y = Math.PI
      treeF.scale.setScalar(0.5)

      scene.add(treeA, treeB, treeC, treeD, treeE, treeF)
    },
    undefined,
    (error) => {
      console.error("Erreur lors du chargement des arbres :", error)
    },
  )
}
