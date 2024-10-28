import * as THREE from 'three';

// Three.js 캔버스 설정
const container = document.body;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// 씬 및 카메라 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15); // 카메라 위치 설정

// 카드가 들어갈 고정된 영역 설정 (fixedRectangle)
const viewportWidth = 12; // 카드 3장을 담을 수 있는 너비
const viewportHeight = 7; // 영역 높이
const viewport = new THREE.Mesh(
    new THREE.PlaneGeometry(viewportWidth, viewportHeight), // 카드가 배치될 영역
    new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide, opacity: 0.3, transparent: true })
);
viewport.position.z = -0.1; // 카드보다 조금 뒤에 배치
scene.add(viewport);

// 카드 생성 함수
function createCard(color: number, positionX: number): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(3, 5); // 카드 크기
  const material = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
  const card = new THREE.Mesh(geometry, material);
  card.position.set(positionX, 0, 0);
  return card;
}

// 카드 그룹 생성
const cardGroup = new THREE.Group();
const numCards = 10; // n개의 카드 생성
const cardSpacing = 4; // 카드 간 간격

// 카드를 최대 10개까지 생성하고 시작할 때 3개가 보이도록 설정
for (let i = 0; i < numCards; i++) {
  const card = createCard(0x1560BD, i * cardSpacing);
  cardGroup.add(card);
}
scene.add(cardGroup);

// 카드 그룹의 시작 위치 조정: 시작 시 3개가 보이도록
cardGroup.position.x = -(3 - 1) * cardSpacing / 2; // 중앙 정렬을 위해 조정

// 마우스 드래그를 통한 스크롤 제어
let isDragging = false;
let previousMousePosition = 0;

container.addEventListener('mousedown', (event) => {
  isDragging = true;
  previousMousePosition = event.clientX;
});

container.addEventListener('mousemove', (event) => {
  if (isDragging) {
    const deltaX = event.clientX - previousMousePosition;
    previousMousePosition = event.clientX;

    // 카드 그룹의 x축을 이동해 좌우 스크롤 구현
    cardGroup.position.x -= deltaX * 0.02;

    // 카드 그룹의 x축 위치 제한: fixedRectangle 영역에 맞게 설정
    const maxScroll = (numCards - 2) * cardSpacing / 2; // 최대 스크롤 한계 설정
    cardGroup.position.x = Math.max(Math.min(cardGroup.position.x, -cardSpacing), -maxScroll * 2);
  }
});

container.addEventListener('mouseup', () => {
  isDragging = false;
});

container.addEventListener('mouseleave', () => {
  isDragging = false;
});

// 클리핑을 위한 설정
const clippingPlanes = [
  new THREE.Plane(new THREE.Vector3(-1, 0, 0), viewportWidth / 2), // 왼쪽
  new THREE.Plane(new THREE.Vector3(1, 0, 0), viewportWidth / 2),  // 오른쪽
  new THREE.Plane(new THREE.Vector3(0, -1, 0), viewportHeight / 2), // 아래쪽
  new THREE.Plane(new THREE.Vector3(0, 1, 0), viewportHeight / 2),  // 위쪽
];

// 카메라의 클리핑 플레인 설정
renderer.clippingPlanes = clippingPlanes;

// 애니메이션 및 렌더 함수
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// 창 크기 조정 이벤트
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
