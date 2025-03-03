import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";
import {MakeDeckScreenCardEffectService} from "./MakeDeckScreenCardEffectService";
import {MakeDeckScreenCardEffect} from "../entity/MakeDeckScreenCardEffect";
import {MakeDeckScreenCardEffectRepositoryImpl} from "../repository/MakeDeckScreenCardEffectRepositoryImpl";
import {MakeDeckScreenCardEffectPositionRepositoryImpl} from "../../make_deck_screen_card_effect_position/repository/MakeDeckScreenCardEffectPositionRepositoryImpl";
import {MakeDeckScreenCardEffectPosition} from "../../make_deck_screen_card_effect_position/entity/MakeDeckScreenCardEffectPosition";

export class MakeDeckScreenCardEffectServiceImpl implements MakeDeckScreenCardEffectService {
    private static instance: MakeDeckScreenCardEffectServiceImpl;
    private makeDeckScreenCardEffectRepository: MakeDeckScreenCardEffectRepositoryImpl;
    private makeDeckScreenCardEffectPositionRepository: MakeDeckScreenCardEffectPositionRepositoryImpl;

    private constructor() {
        this.makeDeckScreenCardEffectRepository = MakeDeckScreenCardEffectRepositoryImpl.getInstance();
        this.makeDeckScreenCardEffectPositionRepository = MakeDeckScreenCardEffectPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): MakeDeckScreenCardEffectServiceImpl {
        if (!MakeDeckScreenCardEffectServiceImpl.instance) {
            MakeDeckScreenCardEffectServiceImpl.instance = new MakeDeckScreenCardEffectServiceImpl();
        }
        return MakeDeckScreenCardEffectServiceImpl.instance;
    }

    public async createMakeDeckScreenCardEffectWithPosition(cardIdToCountMap: Map<number, number>): Promise<THREE.Group | null> {
        const effectGroup = new THREE.Group();
        const raceMap: Record<string, number[]> = {
            "1": [], // humanCardIdList
            "2": [], // undeadCardIdList
            "3": [], // humanCardIdList
        };
        const cardIdList = Array.from(cardIdToCountMap.keys());

        try {
            cardIdList.forEach((cardId)=>{
                const card = getCardById(cardId);
                if (!card) {
                    throw new Error(`Card with ID ${cardId} not found`);
                }
                const cardRace = card.종족;
                switch (cardRace) {
                    case "1":
                        raceMap["1"].push(cardId);
                        break;
                    case "2":
                        raceMap["2"].push(cardId);
                        break;
                    case "3":
                        raceMap["3"].push(cardId);
                        break;
                    default:
                        console.warn(`[WARN] Unknown race "${cardRace}" for cardId: ${cardId}`);
                }
            });
            for (const [race, idList] of Object.entries(raceMap)) {
                await Promise.all(
                    idList.map(async (cardId, index) => {
                        const position = this.makeDeckScreenCardEffectPosition(cardId, index + 1);
                        console.log(`[DEBUG] CardId ${cardId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);

                        const makeDeckScreenCardEffect = await this.createMakeDeckScreenCardEffect(cardId, position.position);
                        effectGroup.add(makeDeckScreenCardEffect.getMesh());
                    })
                );
            }

        } catch (error) {
            console.error(`[Error] Failed to create Card Effect: ${error}`);
            return null;
        }
        return effectGroup;
    }

    public adjustMakeDeckScreenCardEffectPosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const cardIdList = this.getAllCardIdList();
        for (const cardId of cardIdList) {
            const effectMesh = this.getEffectMeshByCardId(cardId);
            if (!effectMesh) {
                console.warn(`[WARN] Effect Mesh with card ID ${cardId} not found`);
                continue;
            }

            const initialPosition = this.getPositionByCardId(cardId);
            console.log(`[DEBUG] (adjust) InitialPosition: ${initialPosition}`);

            if (!initialPosition) {
                console.error(`[DEBUG] (adjust) No position found for card id: ${cardId}`);
                continue;
            }

            const effectWidth = 0.112 * window.innerWidth;
            const effectHeight = 0.345 * window.innerHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;
            console.log(`[DEBUG] (adjust) Card ${cardId}:`, {
                initialPosition: initialPosition,
                newPositionX,
                newPositionY,
            });

            effectMesh.geometry.dispose();
            effectMesh.geometry = new THREE.PlaneGeometry(effectWidth, effectHeight);
            effectMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    private async createMakeDeckScreenCardEffect(cardId: number, position: Vector2d): Promise<MakeDeckScreenCardEffect> {
        return await this.makeDeckScreenCardEffectRepository.createMakeDeckScreenCardEffect(cardId, position);
    }

    private makeDeckScreenCardEffectPosition(cardId: number, cardIndex: number): MakeDeckScreenCardEffectPosition {
        const position = this.makeDeckScreenCardEffectPositionRepository.addMakeDeckScreenCardEffectPosition(cardIndex);
        this.makeDeckScreenCardEffectPositionRepository.save(cardId, position);
        return position;
    }

    public getPositionByCardId(cardId: number): MakeDeckScreenCardEffectPosition | null {
        return this.makeDeckScreenCardEffectPositionRepository.findPositionByCardId(cardId);
    }

    public getEffectMeshByCardId(cardId: number): THREE.Mesh | null {
        const effect = this.makeDeckScreenCardEffectRepository.findEffectByCardId(cardId);
        if (!effect) {
            console.warn(`[WARN] Card with ID ${cardId} not found`);
            return null;
        }
        const effectMesh = effect.getMesh();
        return effectMesh;
    }

    public getAllCardIdList(): number[] {
        return this.makeDeckScreenCardEffectRepository.findCardIdList();
    }

}
