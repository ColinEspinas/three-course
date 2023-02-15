import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Scene
const scene = new THREE.Scene()

// Light
const light = new THREE.DirectionalLight(0xff0000)
light.position.set(0, 0, 45)
scene.add(light)
const light2 = new THREE.DirectionalLight(0xff0000)
light2.position.set(0, 0, -95)
scene.add(light2)

/// / Loading textures
const loader = new THREE.TextureLoader()
const textures = loader.load('/textures/aerial.png')

// Model
/* const loader = new GLTFLoader();
loader.load(
  "/helico.glb",
  (gltf) => {
    const model = gltf.scene;
    // Scale
    model.scale.multiplyScalar(0.07);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error(error);
  }
); */

// BLOB SHAPE

const sphereGeometry = new THREE.SphereGeometry(6, 128, 128)
const material = new THREE.MeshPhysicalMaterial({
  color: 'blue',
  wireframe: false,
})
material.map = textures
material.color = new THREE.Color(0xff0000)

const mesh = new THREE.Mesh(sphereGeometry, material)
// Sizes
const sizes = {
  width: window.innerWidth - 200,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(0, 0, 4)
scene.add(camera, mesh)

// Renderer
const canvas = document.querySelector('.webgl-blob') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({
  canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Animation
const render = () => {
  controls.update()
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
window.addEventListener('resize', onWindowResize)
render()
