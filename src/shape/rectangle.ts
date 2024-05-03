import * as THREE from 'three';
import {Shape} from './shape';


export class Rectangle extends Shape {
    constructor(width: number, height: number, local_translation: THREE.Vector2, global_translation: THREE.Vector2, color: THREE.Color, opacity: number, draw_border: boolean, is_visible: boolean) {
        super(width, height, local_translation, global_translation, color, opacity, draw_border, is_visible);
    }

    public draw(scene: THREE.Scene): void {
        const width = this.getWidth();
        const height = this.getHeight();
        const color = this.getColor();
        const opacity = this.getOpacity();
        const isVisible = this.isVisible();

        if (!isVisible) {
            return; // 가시성이 false이면 더 이상 진행하지 않고 종료합니다.
        }

        // Geometry 생성
        const geometry = new THREE.PlaneGeometry(width, height);

        // 색상 및 투명도 설정
        const material = new THREE.MeshBasicMaterial({
            color: color, // 색상 적용
            transparent: true, // 투명도 적용
            opacity: opacity // 투명도 값 적용
        });

        // Mesh 생성
        const mesh = new THREE.Mesh(geometry, material);

        // Mesh를 씬에 추가
        scene.add(mesh);
    }
}

