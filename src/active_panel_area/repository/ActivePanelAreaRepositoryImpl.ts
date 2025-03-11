import * as THREE from "three";
import {ActivePanelAreaRepository} from "./ActivePanelAreaRepository";

export class ActivePanelAreaRepositoryImpl implements ActivePanelAreaRepository {
    private static instance: ActivePanelAreaRepositoryImpl | null = null;
    private activePanel: THREE.Mesh | null = null;
    private scene: THREE.Scene;
    private camera: THREE.Camera;

    private constructor(camera: THREE.Camera, scene: THREE.Scene) {
        this.camera = camera;
        this.scene = scene;
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): ActivePanelAreaRepositoryImpl {
        if (!ActivePanelAreaRepositoryImpl.instance) {
            ActivePanelAreaRepositoryImpl.instance = new ActivePanelAreaRepositoryImpl(camera, scene);
        }
        return ActivePanelAreaRepositoryImpl.instance;
    }

    create(x: number, y: number): void {
        if (this.activePanel) {
            console.warn("이미 Active Panel이 존재합니다.");
            return;
        }

        console.log(`Active Panel 생성 at (${x}, ${y})`);

        const baseWidth = 0.064935;
        const width = baseWidth * window.innerWidth

        const skillCount = 1; // 우선 skill_count를 1로 설정
        const height = width / 1.617 * (skillCount + 2);

        console.log(`width: ${width}, height: ${height}`)

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            depthTest: false
        });

        this.activePanel = new THREE.Mesh(geometry, material);
        this.activePanel.renderOrder = 3;

        // 마우스 클릭 좌표 → Three.js 좌표 변환
        const mouse = new THREE.Vector3(
            ((x + width * 0.5) / window.innerWidth) * 2 - 1,
            -((y + height * 0.5) / window.innerHeight) * 2 + 1,
            0
        );

        mouse.unproject(this.camera);
        this.activePanel.position.copy(mouse);

        this.scene.add(this.activePanel);
        console.log("Active Panel 추가 완료", this.activePanel.position);
    }

    delete(): void {
        if (!this.activePanel) {
            console.warn("삭제할 Active Panel이 없습니다.");
            return;
        }

        console.log("Active Panel 삭제");

        // 씬에서 제거
        this.scene.remove(this.activePanel);
        this.activePanel.geometry.dispose();
        if (this.activePanel.material instanceof THREE.Material) {
            this.activePanel.material.dispose();
        }

        this.activePanel = null;
    }

    exists(): boolean {
        return this.activePanel !== null;
    }
}
