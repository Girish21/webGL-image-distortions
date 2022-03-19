import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import bg from './assets/bg.jpeg'
import uvbg from './assets/uv-bg.png'
import displacementbg from './assets/soil-displacement.jpg'
import textbg from './assets/text-bg.png'
import fragmentShader from './shaders/fragment.frag?raw'
import vertexShader from './shaders/vertex.vert?raw'

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const mouse = {
  x: 0,
  y: 0,
}

const canvas = document.getElementById('webGL')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const controls = new OrbitControls(camera, canvas)
const renderer = new THREE.WebGLRenderer({ canvas })
const raycaster = new THREE.Raycaster()
const clock = new THREE.Clock()

controls.enableDamping = true

camera.fov = 75
camera.aspect = size.width / size.height
camera.far = 100
camera.near = 0.1
camera.position.set(0, 0, 1)
renderer.setClearColor(0x2a2e3c)

scene.add(camera)

const planeGeometry = new THREE.PlaneBufferGeometry(1.78, 1)
// const planeGeometry = new THREE.PlaneBufferGeometry(1, 1.5)
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: new THREE.TextureLoader().load(bg) },
    uDisplacement: { value: new THREE.TextureLoader().load(uvbg) },
    uTextTexture: { value: new THREE.TextureLoader().load(textbg) },
    uMouse: { value: new THREE.Vector3() },
  },
  transparent: true,
})
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

scene.add(planeMesh)

function resizeHandler() {
  size.height = window.innerHeight
  size.width = window.innerWidth

  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
resizeHandler()

window.addEventListener('resize', resizeHandler)

function tick() {
  const elapsedTime = clock.getElapsedTime()
  const delta = clock.getDelta()

  planeMaterial.uniforms.uTime.value = elapsedTime

  raycaster.setFromCamera({ x: mouse.x, y: mouse.y }, camera)
  const intersects = raycaster.intersectObjects(scene.children)

  for (let i = 0; i < intersects.length; i++) {
    planeMaterial.uniforms.uMouse.value = intersects[i].point
  }

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
const event = isTouch ? 'touchmove' : 'mousemove'
let timeoutId
window.addEventListener(
  event,
  e => {
    if (isTouch && e.touches?.[0]) {
      const touchEvent = e.touches[0]
      mouse.x = (touchEvent.clientX / size.width) * 2 - 1
      mouse.y = (-touchEvent.clientY / size.height) * 2 + 1
    } else {
      mouse.x = (e.clientX / size.width) * 2 - 1
      mouse.y = (-e.clientY / size.height) * 2 + 1
    }

    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      mouse.x = 0
      mouse.y = 0
    }, 1000)
  },
  false
)
