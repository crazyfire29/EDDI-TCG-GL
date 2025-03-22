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
    private raceMap: Map<string, number[]> = new Map(); // race: cardIdList
    private humanEffectGroup: THREE.Group | null = null;
    private undeadEffectGroup: THREE.Group | null = null;
    private trentEffectGroup: THREE.Group | null = null;
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

        const race = card.종족;

        const effectWidth = this.EFFECT_WIDTH * window.innerWidth;
        const effectHeight = this.EFFECT_HEIGHT * window.innerHeight;

        const effectPositionX = position.getX() * window.innerWidth;
        const effectPositionY = position.getY() * window.innerHeight;

        const effectMesh = MeshGenerator.createMesh(texture, effectWidth, effectHeight, position);
        effectMesh.position.set(effectPositionX, effectPositionY, 0);

        const newEffect = new MyCardScreenCardEffect(effectMesh, position);
        this.effectMap.set(newEffect.id, { cardId: cardId, effectMesh: newEffect });

        if (!this.raceMap.has(race)) {
            this.raceMap.set(race, []);
        }
        const cardIdList = this.raceMap.get(race)!;
        cardIdList.push(cardId);
        this.raceMap.set(race, cardIdList);

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

    public findEffectListByRaceId(raceId: string): MyCardScreenCardEffect[] | null {
        const cardIdList = this.raceMap.get(raceId);
        if (cardIdList === undefined) {
            return null;
        }
        const effectMeshList: MyCardScreenCardEffect[] = [];
        cardIdList.forEach((cardId) => {
            const effectMesh = this.findEffectByCardId(cardId);
            if (effectMesh) {
                effectMeshList.push(effectMesh);
            } else {
                console.warn(`[WARN] Card Effect with Card ID ${cardId} not found in raceMap`);
            }
        });
        return effectMeshList;
    }

    public findHumanEffectGroup(): THREE.Group {
        if (!this.humanEffectGroup) {
            this.humanEffectGroup = new THREE.Group();
            this.findEffectListByRaceId("1")?.forEach((effect) => {
                this.humanEffectGroup!.add(effect.getMesh());
            });
        }
        return this.humanEffectGroup;
    }

    public findUndeadEffectGroup(): THREE.Group {
        if (!this.undeadEffectGroup) {
            this.undeadEffectGroup = new THREE.Group();
            this.findEffectListByRaceId("2")?.forEach((effect) => {
                this.undeadEffectGroup!.add(effect.getMesh());
            });
        }
        return this.undeadEffectGroup;
    }

    public findTrentEffectGroup(): THREE.Group {
        if (!this.trentEffectGroup) {
            this.trentEffectGroup = new THREE.Group();
            this.findEffectListByRaceId("3")?.forEach((effect) => {
                this.trentEffectGroup!.add(effect.getMesh());
            });
        }
        return this.trentEffectGroup;
    }

    public resetEffectGroups(): void {
        this.humanEffectGroup = null;
        this.undeadEffectGroup = null;
        this.trentEffectGroup = null;
    }

}
