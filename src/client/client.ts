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

const lights = createLights()
scene.add(...lights)

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

  enemies[0].translateX(0.01)
  enemies[1].translateX(-0.01)
  enemies[2].translateY(0.01)
  enemies[3].translateY(-0.01)
  enemies[4].translateZ(0.01)
  enemies[5].translateZ(-0.01)

  controls.update()

  const colliding = isPlayerColliding()
  if (colliding) {
    console.log('player is colliding')
  }
  render()
}

function render() {
  renderer.render(scene, camera)
}

animate()
listenKeyboardEvents()

function createFloor() {
  const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
  const material = new THREE.MeshPhongMaterial({ color: 'darkgrey', side: THREE.DoubleSide })
  const plane = new THREE.Mesh(geometry, material)
  plane.position.set(0, -1, 0)
  plane.rotateX(1.6)

  return plane
}

function createLights() {
  const light = new THREE.PointLight('#fff', 2, 100)
  light.position.set(0, 5, 0)

  const ambientLight = new THREE.AmbientLight(0xccc, 1)
  ambientLight.position.set(0, 5, 0)
  scene.add(ambientLight)

  return [light, ambientLight]
}

function createPlayer(): THREE.Mesh {
  const geometry = new THREE.BoxGeometry()
  const texture = new THREE.TextureLoader().load('grass.png')

  const material = new THREE.MeshLambertMaterial({ map: texture })

  const player = new THREE.Mesh(geometry, material)
  player.geometry.computeBoundingBox()
  player.updateMatrixWorld()
  return player
}

function createEnemies() {
  const enemies: THREE.Mesh[] = []
  const enemiesColors = ['red', 'blue', 'yellow', 'brown', 'purple', 'pink']

  for (const color of enemiesColors) {
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshPhongMaterial({ color })
    const enemy = new THREE.Mesh(geometry, material)
    enemy.geometry.computeBoundingBox()
    enemy.updateMatrixWorld()
    enemies.push(enemy)
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

function isPlayerColliding() {
  const playerBox = player.geometry.boundingBox!.clone()
  playerBox.applyMatrix4(player.matrixWorld)

  return enemies.some((enemy) => {
    const enemyBox = enemy.geometry.boundingBox!.clone()
    enemyBox.applyMatrix4(enemy.matrixWorld)

    return playerBox.intersectsBox(enemyBox)
  })
}
