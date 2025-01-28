import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";
import {MakeDeckScreenCardService} from "./MakeDeckScreenCardService";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";
import {MakeDeckScreenCardRepository} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepository";
import {MakeDeckScreenCardRepositoryImpl} from "../../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {MakeDeckScreenCardPositionRepositoryImpl} from "../../make_deck_screen_card_position/repository/MakeDeckScreenCardPositionRepositoryImpl";
import {MakeDeckScreenCardPosition} from "../../make_deck_screen_card_position/entity/MakeDeckScreenCardPosition";

export class MakeDeckScreenCardServiceImpl implements MakeDeckScreenCardService {
    private static instance: MakeDeckScreenCardServiceImpl;
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;
    private makeDeckScreenCardPositionRepository: MakeDeckScreenCardPositionRepositoryImpl;

    private constructor(makeDeckScreenCardRepository: MakeDeckScreenCardRepository) {
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
        this.makeDeckScreenCardPositionRepository = MakeDeckScreenCardPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): MakeDeckScreenCardServiceImpl {
        if (!MakeDeckScreenCardServiceImpl.instance) {
            const repository = MakeDeckScreenCardRepositoryImpl.getInstance();
            MakeDeckScreenCardServiceImpl.instance = new MakeDeckScreenCardServiceImpl(repository);
        }
        return MakeDeckScreenCardServiceImpl.instance;
    }

    public async createMakeDeckScreenCardWithPosition(cardIdList: number[]): Promise<THREE.Group | null> {
        const cardGroup = new THREE.Group();
        const cardList = Array.from(new Set(cardIdList));
        const raceMap: Record<string, number[]> = {
            "1": [], // humanCardIdList
            "2": [], // undeadCardIdList
            "3": [], // humanCardIdList
        };

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
                    default:
                        console.warn(`[WARN] Unknown race "${cardRace}" for cardId: ${cardId}`);
                }
            });
            for (const [race, idList] of Object.entries(raceMap)) {
                await Promise.all(
                    idList.map(async (cardId, index) => {
                        const position = this.makeDeckScreenCardPosition(cardId, index + 1);
                        console.log(`[DEBUG] CardId ${cardId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);

                        const makeDeckScreenCard = await this.createMakeDeckScreenCard(cardId, position.position);
                        cardGroup.add(makeDeckScreenCard.getMesh());
                    })
                );
            }

        } catch (error) {
            console.error(`[Error] Failed to create MyDeckCardScene: ${error}`);
            return null;
        }
        return cardGroup;
    }

    private async createMakeDeckScreenCard(cardId: number, position: Vector2d): Promise<MakeDeckScreenCard> {
        return await this.makeDeckScreenCardRepository.createMakeDeckScreenCard(cardId, position);
    }

    private makeDeckScreenCardPosition(cardId: number, cardIndex: number): MakeDeckScreenCardPosition {
        const position = this.makeDeckScreenCardPositionRepository.addMakeDeckScreenCardPosition(cardIndex);
        this.makeDeckScreenCardPositionRepository.save(cardId, position);
        return position;
    }

    public getPositionByCardId(cardId: number): MakeDeckScreenCardPosition | null{
        return this.makeDeckScreenCardPositionRepository.findPositionByCardId(cardId);
    }

    public getCardMeshesByCardId(cardId: number): MakeDeckScreenCard | null {
        return this.makeDeckScreenCardRepository.findCardByCardId(cardId);
    }

}
