import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { params } from './debug'

// eslint-disable-next-line no-console
console.log(params)

// Scene
const scene = new THREE.Scene()

// Light
const light = new THREE.AmbientLight(0xECECEC)
scene.add(light)

// Model
const loader = new GLTFLoader()
loader.load('/helico.glb', (gltf) => {
  const model = gltf.scene
  // Scale
  model.scale.multiplyScalar(0.07)
  scene.add(model)
}, undefined, (error) => {
  console.error(error)
})

// Sizes
const sizes = {
  width: 600,
  height: 400,
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(0, 0, 4)
scene.add(camera)

// Renderer
const canvas = document.querySelector('.webgl') as HTMLCanvasElement
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
  renderer.render(scene, camera)
  window.requestAnimationFrame(render)
}

render()
