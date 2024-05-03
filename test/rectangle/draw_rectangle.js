import * as THREE from 'three';
import { Rectangle } from "../../src/shape/rectangle";
// Three.js를 사용하여 WebGL 렌더러 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Three.js를 사용하여 카메라 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
// Three.js를 사용하여 씬 생성
const scene = new THREE.Scene();
// Rectangle 객체 생성
const rectangle = new Rectangle([1, 0, 0, 1], [[-1, -1], [1, -1], [1, 1], [-1, 1]], new THREE.MeshStandardMaterial({ color: 0xff0000 }), [0, 0], [0, 0]);
rectangle.draw(scene);
// 애니메이션 루프 설정
function animate() {
    requestAnimationFrame(animate);
    // 사각형 회전
    rectangle.rotation.x += 0.01;
    rectangle.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();
