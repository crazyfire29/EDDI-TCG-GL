import * as THREE from "three";
import {ActivePanelAreaRepository} from "./ActivePanelAreaRepository";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {Card} from "../../card/types";
import {getCardById} from "../../card/utility";
import {Texture} from "three";

export class ActivePanelAreaRepositoryImpl implements ActivePanelAreaRepository {
    private static instance: ActivePanelAreaRepositoryImpl | null = null;
    private activePanel: THREE.Mesh | null = null;
    private scene: THREE.Scene;
    private camera: THREE.Camera;

    private textureManager = TextureManager.getInstance();

    private readonly ACTIVE_PANEL_WIDTH_RATIO: number = 0.06493506493
    private readonly ACTIVE_PANEL_HEIGHT_RATIO: number = 0.06493506493 / 1.617

    private readonly ACTIVE_PANEL_BUTTON_WIDTH_RATIO: number = 0.05411255411
    private readonly ACTIVE_PANEL_BUTTON_HEIGHT_RATIO: number = 0.05411255411 / 1.617

    private readonly FIRST_SKILL: number = 1
    private readonly SECOND_SKILL: number = 2

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

    // 버튼 생성 함수
    async createButton(
        textureName: string,
        cardId: number,
        buttonWidth: number,
        buttonHeight: number,
        buttonPosition: Vector2d,
        height: number,
        skillCount: number,
        buttonType: 'general' | 'details' | 'firstSkill' | 'secondSkill'
    ): Promise<THREE.Mesh | null> { // null 반환을 가능하게 함
        const textureManager = TextureManager.getInstance();
        let texture: THREE.Texture | undefined | null = null;

        try {
            switch (buttonType) {
                case 'general':
                    texture = await textureManager.getTexture("active_panel_general", 1);
                    break;
                case 'details':
                    texture = await textureManager.getTexture("active_panel_details", 1);
                    break;
                case 'firstSkill':
                    if (skillCount > 0) { // 스킬이 있는 경우에만 첫 번째 스킬 버튼 생성
                        texture = await textureManager.getSkillButtonTexture(cardId, 1);
                    }
                    break;
                case 'secondSkill':
                    if (skillCount > 1) { // 스킬이 2개 이상인 경우에만 두 번째 스킬 버튼 생성
                        texture = await textureManager.getSkillButtonTexture(cardId, 2);
                    }
                    break;
            }

            if (!texture) {
                console.log(`No texture found for ${buttonType}. Skipping button creation.`);
                return null; // texture가 없으면 null 반환
            }

            const buttonMesh = MeshGenerator.createMesh(texture, buttonWidth, buttonHeight, buttonPosition);
            buttonMesh.renderOrder = 4;

            let offsetY = 0;

            switch (buttonType) {
                case 'general':
                    offsetY = height * 0.5 - buttonHeight * 0.5 - (height * 0.05);
                    break;
                case 'details':
                    offsetY = height * 0.5 - buttonHeight * (1.5 + skillCount) - (height * 0.05);
                    break;
                case 'firstSkill':
                    offsetY = height * 0.5 - buttonHeight * (0.5 + this.FIRST_SKILL) - (height * 0.05);
                    break;
                case 'secondSkill':
                    offsetY = height * 0.5 - buttonHeight * (0.5 + this.SECOND_SKILL) - (height * 0.05);
                    break;
            }

            buttonMesh.position.set(
                buttonPosition.getX(),
                buttonPosition.getY() + offsetY,
                buttonMesh.position.z
            );

            return buttonMesh;

        } catch (error: any) { // error의 타입을 any로 지정
            console.error(`Error while creating button for ${buttonType}: ${error.message}`);
            throw error; // propagate error
        }
    }

// Active Panel 생성
    async create(x: number, y: number, cardId: number): Promise<void> {
        if (this.activePanel) {
            console.warn("이미 Active Panel이 존재합니다.");
            return;
        }

        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }

        const skillCount = Number(card["스킬 개수" as keyof typeof card]) || 0;
        console.log(`Active Panel 생성 at (${x}, ${y})`);

        const width = this.ACTIVE_PANEL_WIDTH_RATIO * window.innerWidth;
        const height = this.ACTIVE_PANEL_HEIGHT_RATIO * window.innerWidth * (skillCount + 2);

        console.log(`width: ${width}, height: ${height}`);

        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            depthTest: false
        });

        this.activePanel = new THREE.Mesh(geometry, material);
        this.activePanel.renderOrder = 2;  // Ensure it's rendered behind the buttons

        const mouse = new THREE.Vector3(
            ((x + width * 0.5) / window.innerWidth) * 2 - 1,
            -((y + height * 0.5) / window.innerHeight) * 2 + 1,
            0
        );

        mouse.unproject(this.camera);
        this.activePanel.position.copy(mouse);
        this.scene.add(this.activePanel);
        console.log("Active Panel 추가 완료", this.activePanel.position);

        const buttonWidth = this.ACTIVE_PANEL_BUTTON_WIDTH_RATIO * window.innerWidth;
        const buttonHeight = this.ACTIVE_PANEL_BUTTON_HEIGHT_RATIO * window.innerWidth;
        const buttonPosition = new Vector2d(mouse.x, mouse.y);

        // General Attack Button
        const attackButtonMesh = await this.createButton("active_panel_general", cardId, buttonWidth, buttonHeight, buttonPosition, height, skillCount, 'general');
        if (attackButtonMesh) {
            this.scene.add(attackButtonMesh);
            console.log("Attack Button 추가 완료", attackButtonMesh.position);
        }

        // Details Button
        const detailsButtonMesh = await this.createButton("active_panel_details", cardId, buttonWidth, buttonHeight, buttonPosition, height, skillCount, 'details');
        if (detailsButtonMesh) {
            this.scene.add(detailsButtonMesh);
            console.log("상세 보기 Button 추가 완료", detailsButtonMesh.position);
        }

        // First Skill Button
        const firstSkillButtonMesh = await this.createButton("active_panel_first_skill", cardId, buttonWidth, buttonHeight, buttonPosition, height, skillCount, 'firstSkill');
        if (firstSkillButtonMesh) {
            this.scene.add(firstSkillButtonMesh);
            console.log("첫 번째 스킬 Button 추가 완료", firstSkillButtonMesh.position);
        }

        // Second Skill Button
        const secondSkillButtonMesh = await this.createButton("active_panel_second_skill", cardId, buttonWidth, buttonHeight, buttonPosition, height, skillCount, 'secondSkill');
        if (secondSkillButtonMesh) {
            this.scene.add(secondSkillButtonMesh);
            console.log("두 번째 스킬 Button 추가 완료", secondSkillButtonMesh.position);
        }
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
