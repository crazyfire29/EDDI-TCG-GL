import * as THREE from 'three';
import { TextureManager } from "../../texture_manager/TextureManager";
import { MyDeckBackground } from '../entity/MyDeckBackground';
import { NonBackgroundImage } from '../../shape/image/NonBackgroundImage';
import { ResourceManager } from '../../resouce_manager/ResourceManager';

export class MyDeckBackgroundScene {
    private scene: THREE.Scene;
    private textureManager: TextureManager;
    private background: NonBackgroundImage | null = null;
    private resourceManager: ResourceManager | null = null;

    constructor() {
        this.scene = new THREE.Scene();
        this.textureManager = TextureManager.getInstance();
    }

    public async addBackground(background: MyDeckBackground): Promise<void> {
        const texture = await this.textureManager.getTexture('my_deck_background', 1);
        console.log("Texture loaded:", texture);
        if (!texture) {
            throw new Error("Texture not found");
        }
        const backgroundWidth = background.getWidth();
        const backgroundHeight = background.getHeight();

        this.background = new NonBackgroundImage(
            backgroundWidth,
            backgroundHeight,
            new THREE.Vector2(0,0)
        );
        console.log("NonBackgroundImage created:", this.background);
        this.background.createNonBackgroundImageWithTexture(texture, 1, 1);
        this.background.draw(this.scene);
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
