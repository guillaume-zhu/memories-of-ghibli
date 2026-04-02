import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI, { Controller } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js"

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")
console.log(canvas)

// Scene
const scene = new THREE.Scene()

// Helpers
const grid = new THREE.GridHelper(10, 10)
scene.add(grid)

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Mouse and Click event
 */
const mouse = new THREE.Vector2()

// Mousemove
canvas.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

// Click
window.addEventListener("click", () => {
  if (currentIntersect) {
    console.log("Objet cliqué :", currentIntersect.object)
  }
})

/**
 * Fonction création GlobalHull (fusion des géométries et contours noirs)
 */
const createGlobalHull = (root, thickness = 0.03) => {
  // Tableau pour stocker les géometries
  const geometries = []

  // ---- Copie et fusion des géométries ---- //
  // Matrice vide pour convertir les répères monde vers le repère du model
  const inverseRootMatrix = new THREE.Matrix4()

  // Mise à jour des matrices du modèle avant fusion
  root.updateMatrixWorld(true)

  // Matrices mondes à matrices locales du model
  inverseRootMatrix.copy(root.matrixWorld).invert()

  // Parcours des child du model
  root.traverse((child) => {
    // Si child n'est pas un mesh
    if (!child.isMesh) {
      return
    }

    // Clonage des géométries
    const geometry = child.geometry.clone()

    // Matrice vide pour la transformation du mesh dans l'espace local
    const localMatrix = new THREE.Matrix4()

    // Ou se trouve le mesh dans repère local par rapport au modèle
    localMatrix.multiplyMatrices(inverseRootMatrix, child.matrixWorld)

    // Inclusion des matrices dans le monde aux géométries copiées
    geometry.applyMatrix4(localMatrix)

    // Ajout de la géométrie finale dans le tableau
    geometries.push(geometry)
  })

  // Sécurité si modèle aucun mesh
  if (geometries.length === 0) {
    return null
  }

  // Fusion des géometries
  const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false)

  // ---- Hull ---- //
  const outlineMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.BackSide,
  })

  const outlineMesh = new THREE.Mesh(mergedGeometry, outlineMaterial)
  outlineMesh.scale.multiplyScalar(1 + thickness)
  outlineMesh.name = "globalHull"

  return outlineMesh
}

/**
 * Fonction création Hitbox pour raycaster hover
 */
const createBoxHitbox = (root, shrinkX = 1, shrinkY = 1, shrinkZ = 1) => {
  // Bounding box autour du model
  const box = new THREE.Box3().setFromObject(root)

  // Récupération des dimensions de la box
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  // Hitbox
  const geometry = new THREE.BoxGeometry(size.x * shrinkX, size.y * shrinkY, size.z * shrinkZ)
  const material = new THREE.MeshBasicMaterial({
    visible: true,
    wireframe: true,
    color: "red",
  })
  const hitbox = new THREE.Mesh(geometry, material)

  // Placement Hitbox
  root.updateMatrixWorld(true)
  root.worldToLocal(center)
  hitbox.position.copy(center)
  hitbox.name = "boxHitbox"

  return hitbox
}

/**
 * Raycaster
 */

// Setup
const raycaster = new THREE.Raycaster()

// Interactive objects pour raycaster
const interactiveObjects = []

// CurrentIntersect pour stocker les objets qui sont en hover
let currentIntersect = null

let hoveredModel = null

/**
 * Models Imports
 */

const gltfLoader = new GLTFLoader()

// ---- Warawara ---- //

gltfLoader.load("models/Warawara.glb", (gltf) => {
  console.log("warawara chargé", gltf)

  const model = gltf.scene

  // Ajout dans la scène
  scene.add(model)

  // -- Création du Hull -- //
  const hull = createGlobalHull(model, 0.025)
  if (hull) {
    model.add(hull)
  }

  // Stockage mémoire du hull dans le model
  model.userData.hull = hull

  // Paramétrage pour le contour en hover
  model.userData.hullBaseScale = 1.03
  model.userData.hullHoverScale = 1.06

  // -- Création de la hitbox -- //
  const hitbox = createBoxHitbox(model, 1, 1, 0.7)

  if (hitbox) {
    model.add(hitbox)
    hitbox.userData.model = model
    interactiveObjects.push(hitbox)
  }
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 5)
scene.add(ambientLight)

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1),
//   new THREE.MeshBasicMaterial({ color: "pink" }),
// )

// scene.add(cube)
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)
renderer.setClearColor("#757575")

/**
 * Animate
 */
const timer = new THREE.Timer()

const tick = () => {
  const elapsedTIme = timer.getElapsed()

  timer.update()

  // Update object
  // cube.position.y = Math.sin(elapsedTIme * 0.8)

  // ---- Raycaster ----
  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(interactiveObjects, false)

  let newHoveredModel = null

  // Si raycaster touche un objet
  if (intersects.length) {
    const hitObject = intersects[0].object
    newHoveredModel = hitObject.userData.model || null
    currentIntersect = intersects[0]

    canvas.style.cursor = "pointer"
  } else {
    currentIntersect = null

    canvas.style.cursor = "default"
  }

  // Si objet hover a changé depuis précédente frame
  if (hoveredModel !== newHoveredModel) {
    if (hoveredModel && hoveredModel.userData.hull) {
      hoveredModel.userData.hull.scale.setScalar(hoveredModel.userData.hullBaseScale)
    }

    if (newHoveredModel && newHoveredModel.userData.hull) {
      newHoveredModel.userData.hull.scale.setScalar(newHoveredModel.userData.hullHoverScale)
    }

    hoveredModel = newHoveredModel
  }

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
