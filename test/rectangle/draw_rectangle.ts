import * as THREE from 'three';
import {Rectangle} from "../../src/shape/Rectangle";

// 씬 생성
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // 흰색 배경

// 카메라 생성
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 렌더러 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 사각형 정점 좌표
// const rectangleVertices = [
//     new THREE.Vector3(-1, 1, 0), // 좌상단
//     new THREE.Vector3(1, 1, 0),  // 우상단
//     new THREE.Vector3(1, -1, 0), // 우하단
//     new THREE.Vector3(-1, -1, 0) // 좌하단
// ];

// const geometry = new THREE.BufferGeometry().setFromPoints(rectangleVertices);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 빨간색 선
// const line = new THREE.LineLoop(geometry, material);
// scene.add(line);

const width = 2;
const height = 2;

const localTranslation = new THREE.Vector2(0, 0);
const globalTranslation = new THREE.Vector2(0, 0);
const color = new THREE.Color(0xff0000); // 빨간색 적용
const opacity = 1.0; // 투명도 설정
const drawBorder = true;
const isVisible = true;

const rectangle = new Rectangle(width, height, localTranslation, globalTranslation, color, opacity, drawBorder, isVisible);

// 사각형을 씬에 추가
renderObject(rectangle);

// 렌더링 함수 정의
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// 렌더링 시작
render();

// Rectangle을 씬에 추가하고 렌더링하는 함수
function renderObject(rectangle: Rectangle) {
    rectangle.draw(scene)
}
