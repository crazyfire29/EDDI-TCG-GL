import * as THREE from 'three';
import { MyDeckButtonPageMovementButtonRepository } from './MyDeckButtonPageMovementButtonRepository';
import {MyDeckButtonPageMovementButton} from "../entity/MyDeckButtonPageMovementButton";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MyDeckButtonPageMovementButtonType} from "../entity/MyDeckButtonPageMovementButtonType";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export class MyDeckButtonPageMovementButtonRepositoryImpl implements MyDeckButtonPageMovementButtonRepository {
    private static instance: MyDeckButtonPageMovementButtonRepositoryImpl;
    private storage: Map<number, MyDeckButtonPageMovementButton> = new Map();
    private textureManager: TextureManager;

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyDeckButtonPageMovementButtonRepositoryImpl {
        if (!MyDeckButtonPageMovementButtonRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyDeckButtonPageMovementButtonRepositoryImpl.instance = new MyDeckButtonPageMovementButtonRepositoryImpl(textureManager);
        }
        return MyDeckButtonPageMovementButtonRepositoryImpl.instance;
    }

    public async createMyDeckButtonPageMovementButton(
        textureName: string,
        type: MyDeckButtonPageMovementButtonType,
        widthPercent: number,
        heightPercent: number,
        positionPercent: THREE.Vector2
    ): Promise<NonBackgroundImage> {
        const texture = await this.textureManager.getTexture(textureName, type);
        if (!texture) throw new Error('MyDeckButtonPageMovementButton texture not found.');

        const nonBackgroundImage = new NonBackgroundImage(
            window.innerWidth * widthPercent,
            window.innerHeight * heightPercent,
            new THREE.Vector2(
                window.innerWidth * positionPercent.x,
                window.innerHeight * positionPercent.y)
        );

        nonBackgroundImage.createNonBackgroundImageWithTexture(texture, 1, 1);

        const button = new MyDeckButtonPageMovementButton(type, widthPercent, heightPercent, positionPercent);
        button.texture = texture;
        this.save(button);

        return nonBackgroundImage;
    }

    public save(button: MyDeckButtonPageMovementButton): void {
        this.storage.set(button.id, button);
    }

    public findById(id: number): MyDeckButtonPageMovementButton | null {
        return this.storage.get(id) || null;
    }

    public findAll(): MyDeckButtonPageMovementButton[] {
        return Array.from(this.storage.values());
    }

    public deleteById(id: number): void {
        this.storage.delete(id);
    }

    public deleteAll(): void {
        this.storage.clear();
    }
}
