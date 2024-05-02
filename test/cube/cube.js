import * as THREE from 'three';
// HTML 파일의 body 요소에 Three.js 캔버스를 렌더링
const container = document.body;
// Three.js를 사용하여 WebGL 렌더러 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
// Three.js를 사용하여 카메라 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
// Three.js를 사용하여 씬 생성
const scene = new THREE.Scene();
// Three.js를 사용하여 사각형 지오메트리 생성
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// 애니메이션 루프 설정
function animate() {
    requestAnimationFrame(animate);
    // 사각형 회전
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
export { cube };
