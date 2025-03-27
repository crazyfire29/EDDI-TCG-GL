import * as THREE from 'three';
import {GlobalNavigationBarEffectRepository} from './GlobalNavigationBarEffectRepository';
import {GlobalNavigationBarEffect} from "../entity/GlobalNavigationBarEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class GlobalNavigationBarEffectRepositoryImpl implements GlobalNavigationBarEffectRepository {
    private static instance: GlobalNavigationBarEffectRepositoryImpl;
    private effectMap: Map<number, GlobalNavigationBarEffect > = new Map();
    private textureManager: TextureManager;

    private readonly EFFECT_WIDTH: number = 0.05
    private readonly EFFECT_HEIGHT: number = 0.058378

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): GlobalNavigationBarEffectRepositoryImpl {
        if (!GlobalNavigationBarEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            GlobalNavigationBarEffectRepositoryImpl.instance = new GlobalNavigationBarEffectRepositoryImpl(textureManager);
        }
        return GlobalNavigationBarEffectRepositoryImpl.instance;
    }

    public async createGlobalNavigationBarEffect(type: number, position: Vector2d): Promise<GlobalNavigationBarEffect> {
        const texture = await this.textureManager.getTexture('global_navigation_bar_effect', type);
        if (!texture) {
            throw new Error(`Texture for Button type: ${type} not found`);
        }

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = this.EFFECT_HEIGHT * window.innerHeight;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new GlobalNavigationBarEffect(effectMesh, this.EFFECT_WIDTH, this.EFFECT_HEIGHT, position);
        this.effectMap.set(newEffect.id, newEffect);

        return newEffect;
    }

    public findEffectById(effectId: number): GlobalNavigationBarEffect | null {
        return this.effectMap.get(effectId) || null;
    }

    public findAllEffect(): GlobalNavigationBarEffect[] {
        return Array.from(this.effectMap.values());
    }

    public deleteEffectById(effectId: number): void {
        this.effectMap.delete(effectId);
    }

    public deleteAllEffect(): void {
        this.effectMap.clear();
    }

    public findAllEffectIdList(): number[] {
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
