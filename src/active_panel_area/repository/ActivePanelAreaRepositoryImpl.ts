import * as THREE from "three";
import {ActivePanelAreaRepository} from "./ActivePanelAreaRepository";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class ActivePanelAreaRepositoryImpl implements ActivePanelAreaRepository {
    private static instance: ActivePanelAreaRepositoryImpl | null = null;
    private activePanel: THREE.Mesh | null = null;
    private scene: THREE.Scene;
    private camera: THREE.Camera;

    private readonly ACTIVE_PANEL_WIDTH_RATIO: number = 0.06493506493
    private readonly ACTIVE_PANEL_HEIGHT_RATIO: number = 0.06493506493 / 1.617

    private readonly ACTIVE_PANEL_BUTTON_WIDTH_RATIO: number = 0.05411255411
    private readonly ACTIVE_PANEL_BUTTON_HEIGHT_RATIO: number = 0.05411255411 / 1.617

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

    async create(x: number, y: number): Promise<void> {
        if (this.activePanel) {
            console.warn("이미 Active Panel이 존재합니다.");
            return;
        }

        console.log(`Active Panel 생성 at (${x}, ${y})`);

        // const baseWidth = 0.064935;
        const baseWidth = this.ACTIVE_PANEL_WIDTH_RATIO;
        const width = baseWidth * window.innerWidth

        const skillCount = 0; // 우선 skill_count를 1로 설정
        // const height = width / 1.617 * (skillCount + 2);
        const height = this.ACTIVE_PANEL_HEIGHT_RATIO * window.innerWidth * (skillCount + 2);

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

        const buttonWidth = this.ACTIVE_PANEL_BUTTON_WIDTH_RATIO * window.innerWidth
        const buttonHeight = this.ACTIVE_PANEL_BUTTON_HEIGHT_RATIO * window.innerWidth
        const singlePanelHeight = this.ACTIVE_PANEL_HEIGHT_RATIO * window.innerWidth

        const heightMargin = singlePanelHeight - buttonHeight

        const textureManager = TextureManager.getInstance();
        const activePanelGeneralAttackTexture = await textureManager.getTexture("active_panel_general", 1);
        if (!activePanelGeneralAttackTexture) {
            throw new Error("Button Texture not found");
        }

        const buttonPosition = new Vector2d(mouse.x, mouse.y);

        const buttonMesh = MeshGenerator.createMesh(
            activePanelGeneralAttackTexture, buttonWidth, buttonHeight, buttonPosition);
        buttonMesh.renderOrder = 4;

        // 버튼을 Active Panel의 기준점에서 상대 위치로 이동
        buttonMesh.position.set(
            buttonPosition.getX(),
            buttonPosition.getY() + height * 0.5 - buttonHeight * 0.5 - heightMargin,
            buttonMesh.position.z
        );

        this.scene.add(buttonMesh);
        console.log("Attack Button 추가 완료", buttonMesh.position);

        const activePanelDetailsTexture = await textureManager.getTexture("active_panel_details", 1);
        if (!activePanelDetailsTexture) {
            throw new Error("Button Texture not found");
        }

        const detailsButtonPosition = new Vector2d(mouse.x, mouse.y);

        const detailsButtonMesh = MeshGenerator.createMesh(
            activePanelDetailsTexture, buttonWidth, buttonHeight, detailsButtonPosition);
        detailsButtonMesh.renderOrder = 4;

        const detailsButtonOffsetY = height * 0.5 - buttonHeight * (1.5 + skillCount) - heightMargin;

        // 버튼을 Active Panel의 기준점에서 상대 위치로 이동
        detailsButtonMesh.position.set(
            buttonPosition.getX(),
            buttonPosition.getY() + detailsButtonOffsetY,
            detailsButtonMesh.position.z
        );

        this.scene.add(detailsButtonMesh);
        console.log("Attack Button 추가 완료", detailsButtonMesh.position);
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
