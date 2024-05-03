import * as THREE from 'three';
import { Scene } from 'three';
import { RectangleImage} from "../../src/shape/image/RectangleImage";

// 이미지 경로 설정
const cardId = 'example_card_id'; // 실제 카드 ID로 변경해야 합니다.
const imagePath = `/assets/eddi_tcg_game/images/battle_field_card/${cardId}.png`;

// 씬 생성
const scene = new THREE.Scene();

// RectangleImage 생성
const width = 10; // 적절한 너비 설정
const height = 10; // 적절한 높이 설정
const imageRectangle = new RectangleImage(width, height, imagePath, 1, 1);

// 씬에 이미지 렌더링
imageRectangle.draw(scene);

// 렌더러 생성 및 렌더링
const renderer = new THREE.WebGLRenderer();
// 렌더러 설정 코드 생략
renderer.render(scene, camera); // camera 객체는 적절하게 정의되어야 합니다.
