import * as THREE from 'three';
import {MyCardScreenCardEffectRepository} from './MyCardScreenCardEffectRepository';
import {MyCardScreenCardEffect} from "../entity/MyCardScreenCardEffect";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class MyCardScreenCardEffectRepositoryImpl implements MyCardScreenCardEffectRepository {
    private static instance: MyCardScreenCardEffectRepositoryImpl;
    private effectMap: Map<number, { cardId: number, effectMesh: MyCardScreenCardEffect }> = new Map(); // effectUniqueId: {cardId: mesh}
    private effectGroup: THREE.Group | null = null;
    private textureManager: TextureManager;

    private readonly EFFECT_WIDTH: number = 0.109
    private readonly EFFECT_HEIGHT: number = 0.3471

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardScreenCardEffectRepositoryImpl {
        if (!MyCardScreenCardEffectRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardScreenCardEffectRepositoryImpl.instance = new MyCardScreenCardEffectRepositoryImpl(textureManager);
        }
        return MyCardScreenCardEffectRepositoryImpl.instance;
    }

    public async createMyCardScreenCardEffect(cardId: number, position: Vector2d): Promise<MyCardScreenCardEffect> {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }

        const texture = await this.textureManager.getTexture('owned_card_effect', card.카드번호);
        if (!texture) {
            throw new Error(`Texture for card ${cardId} not found`);
        }

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = this.EFFECT_HEIGHT * window.innerHeight;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new MyCardScreenCardEffect(effectMesh, position);
        this.effectMap.set(newEffect.id, { cardId: cardId, effectMesh: newEffect });

        return newEffect;
    }

    public findEffectByCardId(cardId: number): MyCardScreenCardEffect | null {
        for (const { cardId: storedCardId, effectMesh } of this.effectMap.values()) {
            if (storedCardId === cardId) {
                return effectMesh;
            }
        }
        return null;
    }

    public findEffectByEffectUniqueId(uniqueId: number): MyCardScreenCardEffect | null {
        const effect = this.effectMap.get(uniqueId);
        if (effect) {
            return effect.effectMesh;
        } else {
            return null;
        }
    }

    public findCardIdByEffectUniqueId(effectUniqueId: number): number | null {
        const effect = this.effectMap.get(effectUniqueId);
        if (effect) {
            return effect.cardId;
        } else {
            return null;
        }
    }

    public findAllEffect(): MyCardScreenCardEffect[] {
        return Array.from(this.effectMap.values()).map(({ effectMesh }) => effectMesh);
    }

    public findAllCardIdList(): number[] {
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

    public findAllEffectGroups(): THREE.Group {
        if (!this.effectGroup) {
            this.effectGroup = new THREE.Group();
            for (const { effectMesh } of this.effectMap.values()) {
                this.effectGroup.add(effectMesh.getMesh());
            }
        }
        return this.effectGroup;
    }

    public resetEffectGroups(): void {
        this.effectGroup = null;
    }

}
