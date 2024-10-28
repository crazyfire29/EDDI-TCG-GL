import * as THREE from 'three';

const container = document.body;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20);

const fixedRectangleWidth = 40;
const fixedRectangleHeight = 6;
const numRectangles = 4;

const fixedRectangles: THREE.Mesh[] = [];

for (let i = 0; i < numRectangles; i++) {
  const fixedRectangle = new THREE.Mesh(
      new THREE.PlaneGeometry(fixedRectangleWidth, fixedRectangleHeight),
      new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide, opacity: 0.3, transparent: true })
  );

  fixedRectangle.position.set(0, (numRectangles / 2 - i - 0.5) * (fixedRectangleHeight + 1), -0.1);
  scene.add(fixedRectangle);
  fixedRectangles.push(fixedRectangle);
}

function createCard(color: number, positionX: number): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(3, 5); // Card size
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  const card = new THREE.Mesh(geometry, material);
  card.position.set(positionX, 0, 0);
  return card;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
