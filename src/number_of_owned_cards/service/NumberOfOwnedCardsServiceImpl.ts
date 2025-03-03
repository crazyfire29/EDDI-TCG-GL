import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";
import {NumberOfOwnedCardsService} from "./NumberOfOwnedCardsService";
import {NumberOfOwnedCards} from "../entity/NumberOfOwnedCards";
import {NumberOfOwnedCardsRepositoryImpl} from "../repository/NumberOfOwnedCardsRepositoryImpl";
import {NumberOfOwnedCardsPositionRepositoryImpl} from "../../number_of_owned_cards_position/repository/NumberOfOwnedCardsPositionRepositoryImpl";
import {NumberOfOwnedCardsPosition} from "../../number_of_owned_cards_position/entity/NumberOfOwnedCardsPosition";

export class NumberOfOwnedCardsServiceImpl implements NumberOfOwnedCardsService {
    private static instance: NumberOfOwnedCardsServiceImpl;
    private numberOfOwnedCardsRepository: NumberOfOwnedCardsRepositoryImpl;
    private numberOfOwnedCardsPositionRepository: NumberOfOwnedCardsPositionRepositoryImpl;

    private constructor() {
        this.numberOfOwnedCardsRepository = NumberOfOwnedCardsRepositoryImpl.getInstance();
        this.numberOfOwnedCardsPositionRepository = NumberOfOwnedCardsPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): NumberOfOwnedCardsServiceImpl {
        if (!NumberOfOwnedCardsServiceImpl.instance) {
            NumberOfOwnedCardsServiceImpl.instance = new NumberOfOwnedCardsServiceImpl();
        }
        return NumberOfOwnedCardsServiceImpl.instance;
    }

    public async createNumberOfOwnedCardsWithPosition(cardIdToCountMap: Map<number, number>): Promise<THREE.Group | null> {
        const numberGroup = new THREE.Group();
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
                        const position = this.makeNumberOfOwnedCardsPosition(cardId, index + 1);
                        console.log(`[DEBUG] CardId ${cardId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);

                        const cardCount = cardIdToCountMap.get(cardId);
                        if (cardCount === undefined) {
                            console.warn(`[WARN] Card count not found for cardId: ${cardId}, defaulting to 0`);
                            return;
                        }

                        if (cardCount >= 2) {
                            console.log(`[DEBUG] Card id: ${cardId}, Card count: ${cardCount}`);
                            const makeNumber = await this.createNumberOfOwnedCards(cardId, cardCount, position.position);
                            numberGroup.add(makeNumber.getMesh());
                        }
                    })
                );
            }

        } catch (error) {
            console.error(`[Error] Failed to create Number: ${error}`);
            return null;
        }
        return numberGroup;
    }

    public adjustNumberOfOwnedCardsPosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const cardIdList = this.getAllCardIdList();
        for (const cardId of cardIdList) {
            const numberMesh = this.getNumberMeshByCardId(cardId);
            if (!numberMesh) {
                console.warn(`[WARN] numberMesh with card ID ${cardId} not found`);
                continue;
            }

            const initialPosition = this.getPositionByCardId(cardId);
            console.log(`[DEBUG] (adjust) InitialPosition: ${initialPosition}`);

            if (!initialPosition) {
                console.error(`[DEBUG] (adjust) No position found for card id: ${cardId}`);
                continue;
            }

            const numberWidth = 0.03 * window.innerWidth;
            const numberHeight = 0.034 * window.innerHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;
            console.log(`[DEBUG] (adjust) Number ${cardId}:`, {
                initialPosition: initialPosition,
                newPositionX,
                newPositionY,
            });

            numberMesh.geometry.dispose();
            numberMesh.geometry = new THREE.PlaneGeometry(numberWidth, numberHeight);
            numberMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    private async createNumberOfOwnedCards(cardId: number, cardCount: number, position: Vector2d): Promise<NumberOfOwnedCards> {
        return await this.numberOfOwnedCardsRepository.createNumberOfOwnedCards(cardId, cardCount, position);
    }

    private makeNumberOfOwnedCardsPosition(cardId: number, cardIndex: number): NumberOfOwnedCardsPosition {
        const position = this.numberOfOwnedCardsPositionRepository.addNumberPosition(cardIndex);
        this.numberOfOwnedCardsPositionRepository.save(cardId, position);
        return position;
    }

    public getPositionByCardId(cardId: number): NumberOfOwnedCardsPosition | null{
        return this.numberOfOwnedCardsPositionRepository.findPositionByCardId(cardId);
    }

    public getNumberMeshByCardId(cardId: number): THREE.Mesh | null {
        const number = this.numberOfOwnedCardsRepository.findNumberByCardId(cardId);
        if (!number) {
            console.warn(`[WARN] Number with Card ID ${cardId} not found`);
            return null;
        }
        const numberMesh = number.getMesh();
        return numberMesh;
    }

    public getAllCardIdList(): number[] {
        return this.numberOfOwnedCardsRepository.findAllCardIds();
    }

}
