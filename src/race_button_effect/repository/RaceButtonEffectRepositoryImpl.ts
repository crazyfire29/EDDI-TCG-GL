import * as THREE from 'three';
import {RaceButtonEffectRepository} from './RaceButtonEffectRepository';
import {RaceButtonEffect} from "../entity/RaceButtonEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {CardRace} from "../../card/race";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class RaceButtonEffectRepositoryImpl implements RaceButtonEffectRepository {
    private static instance: RaceButtonEffectRepositoryImpl;
    private effectMap: Map<number, RaceButtonEffect> = new Map();
    private textureManager: TextureManager;

    private readonly EFFECT_WIDTH: number = 96 / 1920
    private readonly EFFECT_HEIGHT: number = 94 / 1080

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): RaceButtonEffectRepositoryImpl {
        if (!RaceButtonEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            RaceButtonEffectRepositoryImpl.instance = new RaceButtonEffectRepositoryImpl(textureManager);
        }
        return RaceButtonEffectRepositoryImpl.instance;
    }

    public async createRaceButtonEffect(
        type: CardRace,
        position: Vector2d
    ): Promise<RaceButtonEffect> {
        const texture = await this.textureManager.getTexture('race_button_effect', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('Race Button Effect texture not found.');
        }

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = this.EFFECT_HEIGHT * window.innerHeight;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new RaceButtonEffect(type, effectWidth, effectHeight, effectMesh, position);
        this.effectMap.set(newEffect.id, newEffect);

        return newEffect;
    }

    public findById(id: number): RaceButtonEffect | null {
        return this.effectMap.get(id) || null;
    }

    public findAll(): RaceButtonEffect[] {
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

    public hideRaceButtonEffect(effectId: number): void {
        const raceButtonEffect = this.findById(effectId);
        if (raceButtonEffect) {
            raceButtonEffect.getMesh().visible = false;
        }
    }

    public showRaceButtonEffect(effectId: number): void {
        const raceButtonEffect = this.findById(effectId);
        if (raceButtonEffect) {
            raceButtonEffect.getMesh().visible = true;
        }
    }
}
