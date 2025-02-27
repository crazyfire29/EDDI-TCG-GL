import * as THREE from 'three';
import {SelectedCardBlockEffectRepository} from './SelectedCardBlockEffectRepository';
import {SelectedCardBlockEffect} from "../entity/SelectedCardBlockEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class SelectedCardBlockEffectRepositoryImpl implements SelectedCardBlockEffectRepository {
    private static instance: SelectedCardBlockEffectRepositoryImpl;
    private effectMap: Map<number, { cardId: number, effectMesh: SelectedCardBlockEffect }> = new Map(); // effect unique id: {card id: effect mesh}
    private textureManager: TextureManager;

    private readonly EFFECT_WIDTH: number = 0.235
    private readonly EFFECT_HEIGHT: number = 0.145

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): SelectedCardBlockEffectRepositoryImpl {
        if (!SelectedCardBlockEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            SelectedCardBlockEffectRepositoryImpl.instance = new SelectedCardBlockEffectRepositoryImpl(textureManager);
        }
        return SelectedCardBlockEffectRepositoryImpl.instance;
    }

    public async createSelectedCardBlockEffect(cardId: number, position: Vector2d): Promise<SelectedCardBlockEffect> {
        const texture = await this.textureManager.getTexture('selected_card_block_effect', cardId);
        if (!texture) {
            throw new Error(`Texture for Selected Card Block Effect ${cardId} not found`);
        }

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = this.EFFECT_HEIGHT * window.innerHeight;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new SelectedCardBlockEffect(effectMesh, position);
        this.effectMap.set(newEffect.id, { cardId, effectMesh: newEffect });

        return newEffect;
    }

    public findEffectByEffectId(effectId: number): SelectedCardBlockEffect | null {
        const effect = this.effectMap.get(effectId);
        if (effect) {
            return effect.effectMesh;
        } else {
            return null;
        }
    }

    public findEffectByCardId(cardId: number): SelectedCardBlockEffect | null {
        for (const { cardId: storedCardId, effectMesh } of this.effectMap.values()) {
            if (storedCardId === cardId) {
                return effectMesh;
            }
        }
        return null;
    }

    public findEffectIdByCardId(cardId: number): number | null {
        for (const [effectId, { cardId: storedCardId }] of this.effectMap.entries()) {
            if (storedCardId === cardId) {
                return effectId;
            }
        }
        return null;
    }

    public findAllEffects(): SelectedCardBlockEffect[] {
        return Array.from(this.effectMap.values()).map(({ effectMesh }) => effectMesh);
    }

    public findEffectIdList(): number[] {
        return Array.from(this.effectMap.keys());
    }

    public findEffectCardIdList(): number[] {
        return Array.from(this.effectMap.values()).map(({ cardId }) => cardId);
    }

    public containsCardIdInMap(cardId: number): boolean {
        for (const { cardId: storedCardId } of this.effectMap.values()) {
            if (storedCardId === cardId) {
                return true;
            }
        }
        return false;
    }

    public deleteAllEffect(): void {
        this.effectMap.clear();
    }

//     public deleteEffectByEffectId(effectId: number): void {
//         this.effectMap.delete(effectId);
//
//         const newEffectMap = new Map<number, { cardId: number, effectMesh: SelectedCardBlockEffect }>();
//         let newEffectId = 0;
//
//         for (const { cardId, effectMesh } of this.effectMap.values()) {
//             newEffectMap.set(newEffectId++, { cardId, effectMesh });
//         }
//
//         this.effectMap = newEffectMap;
//     }

    // 버튼은 생성될 때마다 고유 아이디가 자동으로 부여되기 때문에 재정렬 필요x
    public deleteEffectByEffectId(effectId: number): void {
        this.effectMap.delete(effectId);
    }

    public deleteEffectByCardId(clickedCardId: number): void {
        let effectIdToDelete: number | null = null;

        // 삭제할 버튼 ID 찾기
        for (const [effectId, { cardId }] of this.effectMap.entries()) {
            if (effectId === clickedCardId) {
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
