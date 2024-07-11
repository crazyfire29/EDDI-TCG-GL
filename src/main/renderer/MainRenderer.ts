import * as THREE from 'three';
import { BattleFieldUnitRenderer } from '../../battle_field_unit/renderer/BattleFieldUnitRenderer';
import { BattleFieldUnitScene } from '../../battle_field_unit/scene/BattleFieldUnitScene';
import { ResourceManager } from '../../resouce_manager/ResourceManager';
import { NonBackgroundImage } from '../../shape/image/NonBackgroundImage';
import {BattleFieldUnitRepository} from "../../battle_field_unit/repository/BattleFieldUnitRepository";

export class MainRenderer {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private unitRenderer: BattleFieldUnitRenderer;
    private background: NonBackgroundImage | null = null;
    private resourceManager: ResourceManager;
    private originalWidth: number;
    private originalHeight: number;

    constructor(container: HTMLElement, width: number, height: number) {
        this.originalWidth = width;
        this.originalHeight = height;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);

        const aspect = width / height;
        const viewSize = height;
        this.camera = new THREE.OrthographicCamera(
            -aspect * viewSize / 2, aspect * viewSize / 2,
            viewSize / 2, -viewSize / 2,
            0.1, 1000
        );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);

        this.resourceManager = new ResourceManager();
        this.resourceManager.registerBattleFieldUnitPath({
            cardPath: 'resource/battle_field_unit/card/{id}.png',
            weaponPath: 'resource/battle_field_unit/sword_power/{id}.png',
            hpPath: 'resource/battle_field_unit/hp/{id}.png',
            energyPath: 'resource/battle_field_unit/energy/{id}.png',
            racePath: 'resource/battle_field_unit/race/{id}.png'
        });

        const unitScene = new BattleFieldUnitScene();
        this.unitRenderer = new BattleFieldUnitRenderer(unitScene, this.resourceManager);
        this.scene.add(unitScene.getScene());

        this.initializeBackground(viewSize, aspect);
    }

    private initializeBackground(viewSize: number, aspect: number): void {
        const backgroundImagePath = 'resource/background/battle_field.png';
        const backgroundWidth = viewSize * aspect;
        const backgroundHeight = viewSize;
        this.background = new NonBackgroundImage(backgroundWidth, backgroundHeight, backgroundImagePath, 1, 1, new THREE.Vector2(0, 0), undefined, undefined, undefined, undefined, undefined, () => {
            if (this.background) {
                console.log('Background texture loaded');
                this.background.draw(this.scene);
                this.ensureBackgroundIsBehind();
            } else {
                console.log('Background initialization failed');
            }
        });
    }

    private ensureBackgroundIsBehind(): void {
        if (this.background && this.background.getMesh()) {
            this.background.getMesh()!.renderOrder = -1;
            // console.log('Background render order set to -1');
        }
    }

    public render(): void {
        this.unitRenderer.render(this.renderer, this.camera);
        this.renderer.render(this.scene, this.camera);
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.render();
    }

    public onResize(newWidth: number, newHeight: number): void {
        const newAspect = newWidth / newHeight;
        this.camera.left = -newAspect * newHeight / 2;
        this.camera.right = newAspect * newHeight / 2;
        this.camera.top = newHeight / 2;
        this.camera.bottom = -newHeight / 2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(newWidth, newHeight);

        if (this.background) {
            const newBackgroundWidth = newHeight * newAspect;
            const newBackgroundHeight = newHeight;
            this.background.setScale(newBackgroundWidth / this.background.getWidth(), newBackgroundHeight / this.background.getHeight());
        }

        const scaleX = newWidth / this.originalWidth;
        const scaleY = newHeight / this.originalHeight;
        this.unitRenderer.scaleUnitList(scaleX, scaleY);
    }
}
