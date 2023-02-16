/// <reference types="vite-plugin-glsl/ext" />

import { Elastic, Quart, gsap } from 'gsap'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import randomWords from 'random-words'

import { usePresets } from './presets'

import fragmentShader from './shaders/blob.frag'
import vertexShader from './shaders/blob.vert'
import { randomRange, randomRangeExcept } from '../utils'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let _width, _height

const options = {
  perlin: {
    speed: 0.4,
    size: 0.7,
    perlins: 1.0,
    decay: 1.2,
    displace: 1.0,
    complex: 0.5,
    waves: 3.7,
    eqcolor: 10.0,
    rcolor: 1.5,
    gcolor: 1.5,
    bcolor: 1.5,
    fragment: true,
    points: false,
    redhell: true,
  },
  rotation: 0.001,
}

const shapeMethods = {
  perlinRandom() {
    gsap.to(options.perlin, 2, {
      // decay: Math.random() * 1.0,
      waves: Math.random() * 20.0,
      complex: Math.random() * 1.0,
      displace: Math.random() * 2.5,
      ease: Elastic.easeOut,
    })
  },
  random() {
    // this.perlin.redhell = Math.random() >= 0.5; // 10 1 0.1 1.2
    gsap.to(options.perlin, 1, {
      eqcolor: 11.0,
      rcolor: Math.random() * 1.5,
      gcolor: Math.random() * 0.5,
      bcolor: Math.random() * 1.5,
      ease: Quart.easeInOut,
    })
  },
  normal() {
    options.perlin.redhell = true // 10 1 0.1 1.2
    gsap.to(options.perlin, 1, {
      // speed: 0.12,
      eqcolor: 10.0,
      rcolor: 1.5,
      gcolor: 1.5,
      bcolor: 1.5,
      ease: Quart.easeInOut,
    })
  },
  darker() {
    options.perlin.redhell = false // 10 1 0.1 1.2
    gsap.to(options.perlin, 1, {
      // speed: 0.5,
      eqcolor: 9.0,
      rcolor: 0.4,
      gcolor: 0.05,
      bcolor: 0.6,
      ease: Quart.easeInOut,
    })
  },
}

let primitive: {
  shape: THREE.Mesh<THREE.IcosahedronGeometry, THREE.ShaderMaterial>
  point: THREE.Points<THREE.IcosahedronGeometry, THREE.ShaderMaterial>
  mesh: THREE.Object3D
}

const mat = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    time: {
      value: 0.1,
    },
    pointscale: {
      value: 0.2,
    },
    decay: {
      value: 0.3,
    },
    size: {
      value: 0.3,
    },
    displace: {
      value: 0.3,
    },
    complex: {
      value: 0.0,
    },
    waves: {
      value: 0.1,
    },
    eqcolor: {
      value: 0.0,
    },
    rcolor: {
      value: 0.0,
    },
    gcolor: {
      value: 0.0,
    },
    bcolor: {
      value: 0.0,
    },
    fragment: {
      value: true,
    },
    redhell: {
      value: true,
    },
  },
  vertexShader,
  fragmentShader,
})

const shapeGroup = new THREE.Group()
const backgroundGroup = new THREE.Group()
const start = Date.now()

let pane: Pane
const { applyPreset, createPreset, presets } = usePresets(options)
const presetOptions = {
  current: 'default',
  new: {
    name: randomWords({ exactly: 1, wordsPerString: 2, separator: '-' })[0],
  },
}

const onWindowResize = () => {
  _width = window.innerWidth
  _height = window.innerHeight
  renderer.setSize(_width, _height)
  camera.aspect = _width / _height
  camera.updateProjectionMatrix()
}

const createWorld = () => {
  _width = window.innerWidth
  _height = window.innerHeight
  // ---
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x292733)
  // ---
  camera = new THREE.PerspectiveCamera(35, _width / _height, 1, 1000)
  camera.position.set(0, 0, 30)
  // ---
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(_width, _height)
  renderer.shadowMap.enabled = true
  // ---
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.maxDistance = 100
  // ---
  document.body.appendChild(renderer.domElement)
  // ---
  window.addEventListener('resize', onWindowResize, false)
}

const createPrimitive = () => {
  const mesh = new THREE.Object3D()
  const geo = new THREE.IcosahedronGeometry(2, 100)
  const wir = new THREE.IcosahedronGeometry(2.3, 2)
  const shape = new THREE.Mesh(geo, mat)
  const point = new THREE.Points(wir, mat)

  shapeGroup.add(point)
  shapeGroup.add(shape)

  scene.add(shapeGroup)

  primitive = {
    mesh,
    shape,
    point,
  }
}

const createBackgroundShapes = (amount: number) => {
  const fog = new THREE.Fog(0x292733, 0, 220)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1)

  for (let i = 0; i < amount; ++i) {
    const randomGeometry = randomRange(0, 2)
    const randomSize = randomRange(1, 4)
    let geometry: any = new THREE.BoxGeometry(randomSize, randomSize, randomSize)
    // sphere background
    if (randomGeometry < 1) {
      geometry = new THREE.SphereGeometry(randomSize, 32 * randomSize, 32 * randomSize)
    }
    const material = new THREE.MeshPhongMaterial({
      color: 0x464356,
      fog: true,
    })
    const mesh = new THREE.Mesh(geometry, material)

    const exceptPositions = Array(20)
      .fill(0)
      .map((_, index) => index - 10)

    mesh.position.x = randomRangeExcept(-100, 100, exceptPositions)
    mesh.position.y = randomRangeExcept(-100, 100, exceptPositions)
    mesh.position.z = randomRangeExcept(-100, 100, exceptPositions)

    mesh.rotation.y += 0.01
    backgroundGroup.add(mesh)
  }
  scene.add(backgroundGroup, ambientLight)
  scene.fog = fog
}

const createGUI = () => {
  pane = new Pane()

  const perlinGUI = pane.addFolder({
    expanded: false,
    title: 'Shape settings',
  })

  perlinGUI.addButton({ title: 'Random perlin options' }).on('click', () => {
    shapeMethods.perlinRandom()
  })
  perlinGUI.addInput(options.perlin, 'speed', { min: 0.1, max: 1.0 })
  perlinGUI.addInput(options.perlin, 'size', { min: 0.0, max: 3.0 })
  perlinGUI.addInput(options.perlin, 'decay', { min: 0.0, max: 1.0 })
  perlinGUI.addInput(options.perlin, 'waves', { min: 0.0, max: 20.0 })
  perlinGUI.addInput(options.perlin, 'complex', { min: 0.1, max: 1.0 })
  perlinGUI.addInput(options.perlin, 'displace', { min: 0.1, max: 2.5 })

  const colorGUI = pane.addFolder({
    expanded: false,
    title: 'Color settings',
  })

  colorGUI.addButton({ title: 'Random colors' }).on('click', () => {
    shapeMethods.random()
  })
  colorGUI.addButton({ title: 'Normal colors' }).on('click', () => {
    shapeMethods.normal()
  })
  colorGUI.addButton({ title: 'Dark colors' }).on('click', () => {
    shapeMethods.darker()
  })
  colorGUI.addInput(options.perlin, 'eqcolor', { label: 'hue', min: 0.0, max: 30.0 })
  colorGUI.addInput(options.perlin, 'rcolor', { label: 'R', min: 0.0, max: 2.5 })
  colorGUI.addInput(options.perlin, 'gcolor', { label: 'G', min: 0.0, max: 2.5 })
  colorGUI.addInput(options.perlin, 'bcolor', { label: 'B', min: 0.0, max: 2.5 })
  colorGUI.addInput(options.perlin, 'redhell', { label: 'Electroflow' })

  const presetsGUI = pane.addFolder({
    index: 0,
    expanded: true,
    title: 'Presets',
  })

  const createPresetList = () =>
    presetsGUI
      .addInput(presetOptions, 'current', {
        index: 0,
        options: Object.keys(presets).reduce((acc, current) => {
          acc[current] = current
          return acc
        }, {} as { [name: string]: string }),
      })
      .on('change', () => {
        applyPreset(presetOptions.current)
      })

  presetsGUI.addSeparator()
  let presetListInput = createPresetList()
  presetsGUI.addInput(presetOptions.new, 'name')
  presetsGUI.addButton({ title: 'Create preset' }).on('click', () => {
    createPreset(presetOptions.new.name)
    presetListInput.dispose()
    presetListInput = createPresetList()
    presetOptions.new.name = randomWords({ exactly: 1, wordsPerString: 2, separator: '-' })[0]
  })

  const miscGUI = pane.addFolder({
    expanded: false,
    title: 'Misc',
  })

  miscGUI.addInput(options.perlin, 'points')
  miscGUI.addInput(options, 'rotation', { min: 0.0, max: 0.05 })
}

const rotate = (amount: number) => {
  if (amount > 0) {
    shapeGroup.rotateX(amount)
    shapeGroup.rotateY(amount)
  }
}

const animate = () => {
  primitive.point.visible = options.perlin.points
  primitive.shape.material.uniforms.time.value = (options.perlin.speed / 1000) * (Date.now() - start)

  mat.uniforms.pointscale.value = options.perlin.perlins
  mat.uniforms.decay.value = options.perlin.decay
  mat.uniforms.size.value = options.perlin.size
  mat.uniforms.displace.value = options.perlin.displace
  mat.uniforms.complex.value = options.perlin.complex
  mat.uniforms.waves.value = options.perlin.waves
  mat.uniforms.fragment.value = options.perlin.fragment

  mat.uniforms.redhell.value = options.perlin.redhell
  mat.uniforms.eqcolor.value = options.perlin.eqcolor
  mat.uniforms.rcolor.value = options.perlin.rcolor
  mat.uniforms.gcolor.value = options.perlin.gcolor
  mat.uniforms.bcolor.value = options.perlin.bcolor

  rotate(options.rotation)

  for (const backgroundShape of backgroundGroup.children) {
    backgroundShape.rotation.x += (Math.random() - 0.5 * 2) * randomRange(0.001, 0.01)
    backgroundShape.rotation.y += (Math.random() - 0.5 * 2) * randomRange(0.001, 0.01)
  }

  pane.importPreset(options)

  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

createWorld()
createGUI()
createPrimitive()
createBackgroundShapes(200)
animate()
