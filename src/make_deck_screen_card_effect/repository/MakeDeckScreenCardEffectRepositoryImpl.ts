import * as THREE from 'three';
import {MakeDeckScreenCardEffectRepository} from './MakeDeckScreenCardEffectRepository';
import {MakeDeckScreenCardEffect} from "../entity/MakeDeckScreenCardEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class MakeDeckScreenCardEffectRepositoryImpl implements MakeDeckScreenCardEffectRepository {
    private static instance: MakeDeckScreenCardEffectRepositoryImpl;
    private effectMap: Map<number, { cardId: number, effectMesh: MakeDeckScreenCardEffect }> = new Map(); // Effect Unique Id: {card id: mesh}
    private textureManager: TextureManager;

    private readonly EFFECT_WIDTH: number = 0.112
    private readonly EFFECT_HEIGHT: number = 0.345

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MakeDeckScreenCardEffectRepositoryImpl {
        if (!MakeDeckScreenCardEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MakeDeckScreenCardEffectRepositoryImpl.instance = new MakeDeckScreenCardEffectRepositoryImpl(textureManager);
        }
        return MakeDeckScreenCardEffectRepositoryImpl.instance;
    }

    public async createMakeDeckScreenCardEffect(cardId: number, position: Vector2d): Promise<MakeDeckScreenCardEffect> {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }

        const texture = await this.textureManager.getTexture('owned_card_effect', card.카드번호);
        if (!texture) {
            throw new Error(`Texture for Card Effect ${cardId} not found`);
        }

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = this.EFFECT_HEIGHT * window.innerHeight;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new MakeDeckScreenCardEffect(effectMesh, position);
        this.effectMap.set(newEffect.id, { cardId: cardId, effectMesh: newEffect });

        return newEffect;
    }

    public findEffectByCardId(cardId: number): MakeDeckScreenCardEffect | null {
        for (const { cardId: storedCardId, effectMesh } of this.effectMap.values()) {
            if (storedCardId === cardId) {
                return effectMesh;
            }
        }
        return null;
    }

    public findAllEffect(): MakeDeckScreenCardEffect[] {
        return Array.from(this.effectMap.values()).map(({ effectMesh }) => effectMesh);
    }

    public findCardIdList(): number[] {
        return Array.from(this.effectMap.values()).map(({ cardId }) => cardId);
    }

    public deleteAllEffect(): void {
        this.effectMap.clear();
    }

    public deleteEffectByCardId(cardIdToDelete: number): void {
        let effectIdToDelete: number | null = null;

        for (const [effectId, { cardId }] of this.effectMap.entries()) {
            if (cardId === cardIdToDelete) {
                effectIdToDelete = effectId;
                break;
            }
        }

        if (effectIdToDelete !== null) {
            this.effectMap.delete(effectIdToDelete);
        }
    }

    public hideEffect(cardId: number): void {
        const effect = this.findEffectByCardId(cardId);
        if (effect) {
            effect.getMesh().visible = false;
        }
    }

    public showEffect(cardId: number): void {
        const effect = this.findEffectByCardId(cardId);
        if (effect) {
            effect.getMesh().visible = true;
        }
    }

}
