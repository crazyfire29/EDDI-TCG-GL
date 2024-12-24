import { RouteMap } from "../../src/router/RouteMap";
import { routes } from "../../src/router/routes";
import { TCGMainLobbyView } from "../../src/lobby/TCGMainLobbyView";

import * as THREE from 'three';
import battleFieldMusic from '@resource/music/battle_field/battle-field.mp3';
import { Component } from "../../src/router/Component";
import { TextureManager } from "../../src/texture_manager/TextureManager";
import { NonBackgroundImage } from "../../src/shape/image/NonBackgroundImage";
import { AudioController } from "../../src/audio/AudioController";
import { MouseController } from "../../src/mouse/MouseController";
import { BattleFieldUnitRepository } from "../../src/battle_field_unit/repository/BattleFieldUnitRepository";
import { Vector2d } from "../../src/common/math/Vector2d";
import { BattleFieldUnit } from "../../src/battle_field_unit/entity/BattleFieldUnit";
import { BattleFieldUnitScene } from "../../src/battle_field_unit/scene/BattleFieldUnitScene";
import { ResourceManager } from "../../src/resouce_manager/ResourceManager";
import { BattleFieldUnitRenderer } from "../../src/battle_field_unit/renderer/BattleFieldUnitRenderer";
import { BattleFieldHandRepository } from "../../src/battle_field_hand/deprecated_repository/BattleFieldHandRepository";
import { CardGenerationHandler } from "../../src/card/handler";
import { BattleFieldHandSceneRepository } from "../../src/battle_field_hand/deprecated_repository/BattleFieldHandSceneRepository";
import { BattleFieldHandPositionRepository } from "../../src/battle_field_hand/deprecated_repository/BattleFieldHandPositionRepository";

import { UserWindowSize } from "../../src/window_size/WindowSize";
import { UnitCardGenerator } from "../../src/card/unit/generate";
import { BattleFieldHandMapRepository } from "../../src/battle_field_hand/repository/BattleFieldHandMapRepository";
import { SupportCardGenerator } from "../../src/card/support/generate";
import { ItemCardGenerator } from "../../src/card/item/generate";
import { EnergyCardGenerator } from "../../src/card/energy/generate";
import {LegacyDragAndDropManager} from "../../src/drag_and_drop/LegacyDragAndDropManager";
import {BattleFieldHandMapRepositoryImpl} from "../../src/battle_field_hand/repository/BattleFieldHandMapRepositoryImpl";

let selectedGroup: THREE.Object3D[] = [];
let selectedObject: NonBackgroundImage | null = null;
let offset = new THREE.Vector3();
let isDragging = false;

let initialPosition = new THREE.Vector3();
let lastPosition = new THREE.Vector3();

export class TCGJustTestBattleFieldDragAndDropView {
    private static instance: TCGJustTestBattleFieldDragAndDropView | null = null;

    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private simulationBattleFieldContainer: HTMLElement;
    private background: NonBackgroundImage | null = null;
    private buttons: NonBackgroundImage[] = [];
    private buttonInitialInfo: Map<string, { positionPercent: THREE.Vector2, widthPercent: number, heightPercent: number }> = new Map();
    private audioController: AudioController;
    private mouseController: MouseController;
    private dragAndDropManager: LegacyDragAndDropManager;

    private battleFieldUnitRepository = BattleFieldUnitRepository.getInstance();
    private battleFieldUnitScene = new BattleFieldUnitScene();
    private battleFieldResourceManager = new ResourceManager();
    private battleFieldUnitRenderer?: BattleFieldUnitRenderer;

    private battleFieldHandMapRepository = BattleFieldHandMapRepositoryImpl.getInstance();
    private battleFieldHandSceneRepository = BattleFieldHandSceneRepository.getInstance();
    private battleFieldHandPositionRepository = BattleFieldHandPositionRepository.getInstance();

    private initialized = false;
    private isAnimating = false;

    private userWindowSize: UserWindowSize;

    private constructor(simulationBattleFieldContainer: HTMLElement) {
        this.simulationBattleFieldContainer = simulationBattleFieldContainer;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.simulationBattleFieldContainer.appendChild(this.renderer.domElement);

        this.userWindowSize = UserWindowSize.getInstance();

        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -aspect * viewSize / 2, aspect * viewSize / 2,
            viewSize / 2, -viewSize / 2,
            0.1, 1000
        );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);

        this.dragAndDropManager = LegacyDragAndDropManager.getInstance(this.camera, this.scene);

        this.textureManager = TextureManager.getInstance();
        this.audioController = AudioController.getInstance();
        this.audioController.setMusic(battleFieldMusic);

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.mouseController = new MouseController(this.camera, this.scene);

        // this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        // this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        // this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.renderer.domElement.addEventListener('mousedown', (e) => this.dragAndDropManager.onMouseDown(e), false);
        this.renderer.domElement.addEventListener('mousemove', (e) => this.dragAndDropManager.onMouseMove(e), false);
        this.renderer.domElement.addEventListener('mouseup', () => this.dragAndDropManager.onMouseUp(), false);

        window.addEventListener('click', () => this.initializeAudio(), { once: true });
    }

    public static getInstance(simulationBattleFieldContainer: HTMLElement): TCGJustTestBattleFieldDragAndDropView {
        if (!TCGJustTestBattleFieldDragAndDropView.instance) {
            TCGJustTestBattleFieldDragAndDropView.instance = new TCGJustTestBattleFieldDragAndDropView(simulationBattleFieldContainer);
        }
        return TCGJustTestBattleFieldDragAndDropView.instance;
    }

    // public onMouseDown(event: MouseEvent): void {
    //     const mouse = new THREE.Vector2(
    //         (event.clientX / window.innerWidth) * 2 - 1,
    //         -(event.clientY / window.innerHeight) * 2 + 1
    //     );
    //
    //     const raycaster = new THREE.Raycaster();
    //     raycaster.setFromCamera(mouse, this.camera);
    //
    //     const intersects = raycaster.intersectObjects(
    //         this.scene.children.filter(child => child !== this.background?.getMesh())
    //     );
    //
    //     if (intersects.length > 0) {
    //         selectedObject = intersects[0].object;
    //         lastPosition.copy(selectedObject.position); // 카드의 초기 위치 저장
    //         selectedGroup = this.getAssociatedObjects(selectedObject);
    //
    //         offset.copy(intersects[0].point).sub(lastPosition); // 초기 위치를 기준으로 오프셋 설정
    //         isDragging = true;
    //     }
    // }
    //
    // public onMouseMove(event: MouseEvent): void {
    //     if (isDragging && selectedObject) {
    //         const mouse = new THREE.Vector2(
    //             (event.clientX / window.innerWidth) * 2 - 1,
    //             -(event.clientY / window.innerHeight) * 2 + 1
    //         );
    //
    //         const raycaster = new THREE.Raycaster();
    //         raycaster.setFromCamera(mouse, this.camera);
    //
    //         const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    //         const intersection = new THREE.Vector3();
    //         raycaster.ray.intersectPlane(plane, intersection);
    //
    //         // 드래그 중인 카드의 새로운 위치
    //         const newPosition = intersection.sub(offset);
    //
    //         // 선택된 카드의 위치를 이동
    //         selectedObject.position.copy(newPosition);
    //
    //         // 주변 객체들의 위치를 조정 (이동량 계산)
    //         const movement = newPosition.clone().sub(lastPosition); // 이동량 계산
    //         selectedGroup.forEach((obj: THREE.Object3D) => {
    //             obj.position.add(movement.clone());
    //         });
    //
    //         // 마지막 위치 업데이트
    //         lastPosition.copy(newPosition);
    //     }
    // }
    //
    // public onMouseUp(): void {
    //     isDragging = false;
    //     selectedObject = null;
    //     selectedGroup = [];
    //     lastPosition.set(0, 0, 0); // 초기 위치 초기화
    // }
    //
    // // 선택된 객체와 관련된 모든 객체를 가져오는 메서드
    // private getAssociatedObjects(object: THREE.Object3D): THREE.Object3D[] {
    //     const associatedObjects: THREE.Object3D[] = [];
    //
    //     if (object.parent) {
    //         object.parent.children.forEach(child => {
    //             if (child !== object) { // 선택된 객체는 제외
    //                 associatedObjects.push(child);
    //             }
    //         });
    //     }
    //
    //     return associatedObjects;
    // }

    private async initializeAudio(): Promise<void> {
        try {
            await this.audioController.playMusic();
        } catch (error) {
            console.error('Initial audio play failed:', error);
        }
    }

    public async initialize(): Promise<void> {
        if (this.initialized) {
            this.show();
            return;
        }

        await this.textureManager.preloadTextures("image-paths.json");
        this.addBackground();
        // this.addTransparentRectangle();
        this.addYourHandUnitList();

        this.initialized = true;
        this.isAnimating = true;

        this.animate();
    }

    public show(): void {
        this.renderer.domElement.style.display = 'block';
        this.simulationBattleFieldContainer.style.display = 'block';
        this.isAnimating = true;
        if (!this.initialized) {
            this.initialize();
        } else {
            this.animate();
        }
    }

    public hide(): void {
        this.isAnimating = false;
        this.renderer.domElement.style.display = 'none';
        this.simulationBattleFieldContainer.style.display = 'none';
    }

    private async addBackground(): Promise<void> {
        const texture = await this.textureManager.getTexture('battle_field_background', 1);
        if (texture && !this.background) {
            this.background = new NonBackgroundImage(
                window.innerWidth,
                window.innerHeight,
                new THREE.Vector2(0, 0)
            );
            this.background.createNonBackgroundImageWithTexture(texture, 1, 1);
            this.background.draw(this.scene);
            this.dragAndDropManager.setBackground(this.background)
        } else if (!texture) {
            console.error("Background texture not found.");
        }
    }

    private async addYourHandUnitList(): Promise<void> {
        const battleFieldHandList = this.battleFieldHandMapRepository.getBattleFieldHandList();

        let indexCount = 0;

        for (const listNumber of battleFieldHandList) {
            const positionVector = this.battleFieldHandPositionRepository.addBattleFieldHandPosition(indexCount);
            const createdHand = await CardGenerationHandler.createCardById(listNumber, positionVector, indexCount);

            if (createdHand) {
                this.battleFieldHandSceneRepository.addBattleFieldHandScene(createdHand);
                this.scene.add(createdHand);
            }
            indexCount++;
        }
    }

    private addTransparentRectangle(): void {
        const rectWidth = window.innerWidth * 0.7; // 사각형 너비
        const rectHeight = window.innerHeight * 0.23; // 사각형 높이

        // PlaneGeometry 생성
        const geometry = new THREE.PlaneGeometry(rectWidth, rectHeight);

        // 빨간색 재질 적용
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            opacity: 1,
            transparent: true,
        });

        // Mesh 생성
        const rectangle = new THREE.Mesh(geometry, material);
        const xPos = 0;
        const yPos = -(window.innerHeight / 2) + (0.024 * 3 + 0.11 * 2.5) * window.innerHeight;
        rectangle.position.set(xPos, yPos, 0);

        // renderOrder 속성 설정
        rectangle.renderOrder = 1; // Background보다 높게 설정하여 먼저 렌더링

        this.scene.add(rectangle);
    }

    private onWindowResize(): void {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        if (newWidth !== this.userWindowSize.getWidth() || newHeight !== this.userWindowSize.getHeight()) {
            const aspect = newWidth / newHeight;
            const viewSize = newHeight;

            this.camera.left = -aspect * viewSize / 2;
            this.camera.right = aspect * viewSize / 2;
            this.camera.top = viewSize / 2;
            this.camera.bottom = -viewSize / 2;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(newWidth, newHeight);

            if (this.background) {
                const scaleX = newWidth / this.background.getWidth();
                const scaleY = newHeight / this.background.getHeight();
                this.background.setScale(scaleX, scaleY);
            }

            this.buttons.forEach(button => {
                const initialInfo = this.buttonInitialInfo.get(button.getMesh()?.uuid ?? '');
                if (initialInfo) {
                    const buttonWidth = window.innerWidth * initialInfo.widthPercent;
                    const buttonHeight = window.innerHeight * initialInfo.heightPercent;
                    const newPosition = new THREE.Vector2(
                        window.innerWidth * initialInfo.positionPercent.x,
                        window.innerHeight * initialInfo.positionPercent.y
                    );

                    button.setPosition(newPosition.x, newPosition.y);
                    button.setScale(buttonWidth / button.getWidth(), buttonHeight / button.getHeight());
                }
            });

            this.userWindowSize.calculateScaleFactors(newWidth, newHeight);
            const { scaleX, scaleY } = this.userWindowSize.getScaleFactors();
            UnitCardGenerator.adjustHandCardPositions();
            SupportCardGenerator.adjustCardPositions();
            ItemCardGenerator.adjustCardPositions();
            EnergyCardGenerator.adjustCardPositions();
        }
    }

    private animate(): void {
        if (this.isAnimating) {
            requestAnimationFrame(() => this.animate());
            this.renderer.render(this.scene, this.camera);
        } else {
            console.log('Animation stopped.');
        }
    }
}

const rootElement = document.getElementById('app');
if (!rootElement) {
    throw new Error("Cannot find element with id 'app'.");
}

const fieldView = TCGJustTestBattleFieldDragAndDropView.getInstance(rootElement);
fieldView.initialize();
