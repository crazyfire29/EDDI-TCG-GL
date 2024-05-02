import * as THREE from 'three';
import { Rectangle } from "../../src/shape/rectangle";

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

// 사각형 생성
const rectangleVertices = [
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, -1, 0),
    new THREE.Vector3(-1, -1, 0)
];
const localTranslation = new THREE.Vector2(0, 0);
const globalTranslation = new THREE.Vector2(0, 0);
const color = new THREE.Color(0xff0000); // 빨간색 적용
const drawBorder = true;
const isVisible = true;

const rectangle = new Rectangle(rectangleVertices, localTranslation, globalTranslation, color, drawBorder, isVisible);

// 사각형을 씬에 추가
drawRectangle(rectangle);

// 렌더링 함수 정의
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// 렌더링 시작
render();

// Rectangle을 씬에 추가하고 렌더링하는 함수
function drawRectangle(rectangle: Rectangle) {
    const vertices = rectangle.getVertices();
    const color = rectangle.getColor();
    const drawBorder = rectangle.isDrawBorder();
    const isVisible = rectangle.isVisible();

    if (!isVisible) {
        return;
    }

    // Geometry 생성
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [0, 1, 2, 0, 2, 3]; // 사각형을 그리기 위한 인덱스 배열

    for (const vertex of vertices) {
        positions.push(vertex.x + globalTranslation.x + localTranslation.x);
        positions.push(vertex.y + globalTranslation.y + localTranslation.y);
        positions.push(vertex.z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices);

    // 색상 및 투명도 설정
    const material = new THREE.MeshBasicMaterial({
        color: color, // 색상 적용
        transparent: true, // 투명도 적용
        opacity: color.a // Alpha 값 적용
    });

    // Mesh 생성 및 씬에 추가
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    if (drawBorder) {
        // 테두리 그리기
        const borderGeometry = new THREE.BufferGeometry();
        const borderPositions: number[] = [];

        for (const vertex of vertices) {
            borderPositions.push(vertex.x + globalTranslation.x + localTranslation.x);
            borderPositions.push(vertex.y + globalTranslation.y + localTranslation.y);
            borderPositions.push(vertex.z + 0.1); // 테두리를 사각형 위로 올림
        }

        borderPositions.push(vertices[0].x + globalTranslation.x + localTranslation.x);
        borderPositions.push(vertices[0].y + globalTranslation.y + localTranslation.y);
        borderPositions.push(vertices[0].z + 0.1); // 테두리를 사각형 위로 올림

        borderGeometry.setAttribute('position', new THREE.Float32BufferAttribute(borderPositions, 3));

        const borderMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const borderLine = new THREE.LineLoop(borderGeometry, borderMaterial);
        scene.add(borderLine);
    }
}
