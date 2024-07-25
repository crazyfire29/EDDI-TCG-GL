import * as THREE from 'three';
import { BattleFieldBackground } from '../entity/BattleFieldBackground';
import { LegacyNonBackgroundImage } from '../../shape/image/LegacyNonBackgroundImage';
import { ResourceManager } from '../../resouce_manager/ResourceManager';

export class BattleFieldBackgroundScene {
    private scene: THREE.Scene;
    private background: LegacyNonBackgroundImage | null = null;
    private resourceManager: ResourceManager | null = null;

    constructor(resourceManager: ResourceManager) {
        this.scene = new THREE.Scene();
        this.resourceManager = resourceManager;
    }

    public addBackground(background: BattleFieldBackground): void {
        const backgroundImagePath = background.getImagePath();
        const backgroundWidth = background.getWidth();
        const backgroundHeight = background.getHeight();
        const position = background.getLocalTranslationPosition();

        this.background = new LegacyNonBackgroundImage(
            backgroundWidth,
            backgroundHeight,
            backgroundImagePath,
            1,
            1,
            new THREE.Vector2(position.getX(), position.getY()),
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            () => {
                this.background!.draw(this.scene);
            }
        );
    }

    public resizeBackground(newHeight: number, newAspect: number): void {
        if (this.background) {
            const newBackgroundWidth = newHeight * newAspect;
            const newBackgroundHeight = newHeight;
            this.background.setScale(
                newBackgroundWidth / this.background.getWidth(),
                newBackgroundHeight / this.background.getHeight()
            );
        }
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }
}
