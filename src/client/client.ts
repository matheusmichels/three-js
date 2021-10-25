import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const floor = createFloor()
scene.add(floor)

const light = createLight()
scene.add(light)

const player = createPlayer()
scene.add(player)

const enemies = createEnemies()
scene.add(...enemies)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  render()
}

function animate() {
  requestAnimationFrame(animate)

  enemies[0].translateX(0.1)
  enemies[1].translateX(-0.1)
  enemies[2].translateY(0.1)
  enemies[3].translateY(-0.1)
  enemies[4].translateZ(0.1)
  enemies[5].translateZ(-0.1)

  //   light.translateX(0.1)
  //   light.translateY(0.1)

  controls.update()

  checkCollisions()
  render()
}

function render() {
  renderer.render(scene, camera)
  listenKeyboardEvents()
}

animate()

function createFloor() {
  const geometry = new THREE.PlaneGeometry(10, 10, 1, 1)
  const material = new THREE.MeshPhongMaterial({ color: 'darkgrey', side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(0, -1, 0)
  plane.rotateX(1.6)

  return plane
}

function createLight() {
  const light = new THREE.PointLight(0xff2, 10000, 10000, 100)
  //   light.position.set(10, 10, 10)

  return light
}

function createPlayer(): THREE.Mesh {
  const geometry = new THREE.BoxGeometry()
  const texture = new THREE.TextureLoader().load('grass.png')

  const material = new THREE.MeshLambertMaterial({ map: texture })

  const player = new THREE.Mesh(geometry, material)
  return player
}

function createEnemies() {
  const enemies: THREE.Mesh[] = []
  const enemiesColors = ['red', 'blue', 'yellow', 'brown', 'purple', 'pink']

  for (const color of enemiesColors) {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshPhongMaterial({ color })
    enemies.push(new THREE.Mesh(geometry, material))
  }

  return enemies
}

function listenKeyboardEvents() {
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        player.rotation.z += 0.1
        break
      case 38:
        player.rotation.x -= 0.1
        break
      case 39:
        player.rotation.z -= 0.1
        break
      case 40:
        player.rotation.x += 0.1
        break
      case 87:
        player.translateY(0.1)
        break
      case 83:
        player.translateY(-0.1)
        break
      case 65:
        player.translateX(-0.1)
        break
      case 68:
        player.translateX(0.1)
        break
    }
  }
}

function checkCollisions() {}
