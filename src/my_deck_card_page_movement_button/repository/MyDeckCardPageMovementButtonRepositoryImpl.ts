import * as THREE from 'three';
import { MyDeckCardPageMovementButtonRepository } from './MyDeckCardPageMovementButtonRepository';
import {MyDeckCardPageMovementButton} from "../entity/MyDeckCardPageMovementButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MyDeckCardPageMovementButtonType} from "../entity/MyDeckCardPageMovementButtonType";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export class MyDeckCardPageMovementButtonRepositoryImpl implements MyDeckCardPageMovementButtonRepository {
    private static instance: MyDeckCardPageMovementButtonRepositoryImpl;
    private storage: Map<number, MyDeckCardPageMovementButton> = new Map();
    private textureManager: TextureManager;

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyDeckCardPageMovementButtonRepositoryImpl {
        if (!MyDeckCardPageMovementButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyDeckCardPageMovementButtonRepositoryImpl.instance = new MyDeckCardPageMovementButtonRepositoryImpl(textureManager);
        }
        return MyDeckCardPageMovementButtonRepositoryImpl.instance;
    }

    public async createMyDeckCardPageMovementButton(
        textureName: string,
        type: MyDeckCardPageMovementButtonType,
        widthPercent: number,
        heightPercent: number,
        positionPercent: THREE.Vector2
    ): Promise<NonBackgroundImage> {
        const texture = await this.textureManager.getTexture(textureName, type);
        if (!texture) throw new Error('MyDeckCardPageMovementButton texture not found.');

        const nonBackgroundImage = new NonBackgroundImage(
            window.innerWidth * widthPercent,
            window.innerHeight * heightPercent,
            new THREE.Vector2(
                window.innerWidth * positionPercent.x,
                window.innerHeight * positionPercent.y)
        );

        nonBackgroundImage.createNonBackgroundImageWithTexture(texture, 1, 1);

        const button = new MyDeckCardPageMovementButton(type, widthPercent, heightPercent, positionPercent);
        button.texture = texture;
        this.save(button);

        return nonBackgroundImage;
    }

    public save(button: MyDeckCardPageMovementButton): void {
        this.storage.set(button.id, button);
    }

    public findById(id: number): MyDeckCardPageMovementButton | null {
        return this.storage.get(id) || null;
    }

    public findAll(): MyDeckCardPageMovementButton[] {
        return Array.from(this.storage.values());
    }

    public deleteById(id: number): void {
        this.storage.delete(id);
    }

    public deleteAll(): void {
        this.storage.clear();
    }
}
