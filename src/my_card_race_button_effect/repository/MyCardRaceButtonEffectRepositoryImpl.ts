import * as THREE from 'three';
import {MyCardRaceButtonEffectRepository} from './MyCardRaceButtonEffectRepository';
import {MyCardRaceButtonEffect} from "../entity/MyCardRaceButtonEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {CardRace} from "../../card/race";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyCardRaceButtonEffectRepositoryImpl implements MyCardRaceButtonEffectRepository {
    private static instance: MyCardRaceButtonEffectRepositoryImpl;
    private effectMap: Map<number, MyCardRaceButtonEffect> = new Map();
    private textureManager: TextureManager;

    private readonly EFFECT_WIDTH: number = 0.068
    private readonly EFFECT_HEIGHT: number = 0.131

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardRaceButtonEffectRepositoryImpl {
        if (!MyCardRaceButtonEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardRaceButtonEffectRepositoryImpl.instance = new MyCardRaceButtonEffectRepositoryImpl(textureManager);
        }
        return MyCardRaceButtonEffectRepositoryImpl.instance;
    }

    public async createRaceButtonEffect(type: CardRace, position: Vector2d): Promise<MyCardRaceButtonEffect> {
        const texture = await this.textureManager.getTexture('my_card_race_button_effect', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('My Card Race Button Effect texture not found.');
        }

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = effectWidth;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new MyCardRaceButtonEffect(type, effectWidth, effectHeight, effectMesh, position);
        this.effectMap.set(newEffect.id, newEffect);

        return newEffect;
    }

    public findEffectById(id: number): MyCardRaceButtonEffect | null {
        return this.effectMap.get(id) || null;
    }

    public findAllEffect(): MyCardRaceButtonEffect[] {
        return Array.from(this.effectMap.values());
    }

    public deleteById(id: number): void {
        this.effectMap.delete(id);
    }

    public deleteAll(): void {
        this.effectMap.clear();
    }

    public findAllEffectIds(): number[] {
        return Array.from(this.effectMap.keys());
    }

    public hideEffect(effectId: number): void {
        const effect = this.findEffectById(effectId);
        if (effect) {
            effect.getMesh().visible = false;
        }
    }

    public showEffect(effectId: number): void {
        const effect = this.findEffectById(effectId);
        if (effect) {
            effect.getMesh().visible = true;
        }
    }
}
