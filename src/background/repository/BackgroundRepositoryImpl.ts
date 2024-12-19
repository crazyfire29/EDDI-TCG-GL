import * as THREE from 'three';
import { BackgroundRepository } from './BackgroundRepository';
import {Background} from "../entity/Background";
import {TextureManager} from "../../texture_manager/TextureManager";
import {BackgroundType} from "../entity/BackgroundType";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export class BackgroundRepositoryImpl implements BackgroundRepository {
    private static instance: BackgroundRepositoryImpl;
    private storage: Map<number, Background> = new Map();
    private textureManager: TextureManager;

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): BackgroundRepositoryImpl {
        if (!BackgroundRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            BackgroundRepositoryImpl.instance = new BackgroundRepositoryImpl(textureManager);
        }
        return BackgroundRepositoryImpl.instance;
    }

    public async createBackground(
        textureName: string,
        type: BackgroundType,
        width: number,
        height: number
    ): Promise<NonBackgroundImage> {
        const texture = await this.textureManager.getTexture(textureName, type);
        if (!texture) throw new Error('Background texture not found.');

        const nonBackgroundImage = new NonBackgroundImage(
            window.innerWidth,
            window.innerHeight,
            new THREE.Vector2(0, 0)
        );

        nonBackgroundImage.createNonBackgroundImageWithTexture(texture, 1, 1);

        const background = new Background(type, width, height, new THREE.Vector2(0, 0));
        background.texture = texture;
        this.save(background);

        return nonBackgroundImage;
    }

    public save(background: Background): void {
        this.storage.set(background.id, background);
    }

    public findById(id: number): Background | null {
        return this.storage.get(id) || null;
    }

    public findAll(): Background[] {
        return Array.from(this.storage.values());
    }

    public deleteById(id: number): void {
        this.storage.delete(id);
    }

    public deleteAll(): void {
        this.storage.clear();
    }
}
