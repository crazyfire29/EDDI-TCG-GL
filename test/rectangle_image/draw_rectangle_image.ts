import * as THREE from 'three';
import { RectangleImage } from "../../src/shape/image/RectangleImage";

// HTML 파일의 body 요소에 Three.js 캔버스를 렌더링
const container = document.body;

// Three.js를 사용하여 WebGL 렌더러 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Three.js를 사용하여 카메라 생성
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 1000);
camera.position.set(0, 0, 5);

// Three.js를 사용하여 씬 생성
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// RectangleImage 생성
const cardId = 19;
const imagePath = `resource/${cardId}.png`;

console.log(imagePath);

const width = 1; // 적절한 너비 설정
const height = 1.615; // 적절한 높이 설정
// const imageRectangle = new RectangleImage(width, height, imagePath, 1, 1);
//
// // 씬에 이미지 렌더링
// imageRectangle.draw(scene);
const imageRectangle = new RectangleImage(width, height, imagePath, 1, 1, undefined, undefined, undefined, undefined, undefined, undefined, () => {
    // 콜백 함수: 텍스처 로딩이 완료되었을 때 실행됨
    // 씬에 이미지 렌더링
    imageRectangle.draw(scene);
});

// 애니메이션 루프 설정
function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();
