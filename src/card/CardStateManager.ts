import { CardInitialInfo } from "./CardInitialInfoType";
import {BufferGeometry, Material, Mesh} from "three";
import {Vector2d} from "../common/math/Vector2d";


export class CardStateManager {
    private static handCardInitialInfoMap: Map<string, CardInitialInfo> = new Map();
    private static fieldCardInitialInfoMap: Map<string, CardInitialInfo> = new Map();

    // private static nextFieldIndex: number = 0;

    static addCardToHand(cardId: string, info: CardInitialInfo) {
        this.handCardInitialInfoMap.set(cardId, info);
    }

    // static removeCardFromHand(cardMesh: Mesh<BufferGeometry, Material>) {
    //     for (let [key, value] of this.handCardInitialInfoMap) {
    //         if (value.cardMesh === cardMesh) {
    //             this.fieldCardInitialInfoMap.set(key, value);
    //             this.handCardInitialInfoMap.delete(key);
    //             console.log(`Card with mesh ${cardMesh} removed from hand and added to field.`);
    //         }
    //     }
    // }

    static getNextFieldIndex(): number {
        if (this.fieldCardInitialInfoMap.size === 0) {
            return 0;  // No cards on the field, start with index 0
        } else {
            // Find the max cardIndex from existing field cards and return max + 1
            let maxIndex = -1;
            for (const cardInfo of this.fieldCardInitialInfoMap.values()) {
                if (cardInfo.cardIndex > maxIndex) {
                    maxIndex = cardInfo.cardIndex;
                }
            }
            return maxIndex + 1;  // Next available index
        }
    }

    static removeCardFromHand(cardMesh: Mesh<BufferGeometry, Material>, cardIndex: number) {
        let targetCardId: string | undefined = undefined;
        const cardsToMove: Map<string, CardInitialInfo> = new Map();

        // 그룹 내 모든 카드를 가져오기 위해 cardIndex를 기반으로 그룹을 찾아냄
        for (const [key, value] of this.handCardInitialInfoMap) {
            if (value.cardMesh === cardMesh) {
                targetCardId = key;
                // cardIndex를 바로 전달받아서 그룹의 카드들을 관리
                const groupIndex = value.cardIndex;
                this.handCardInitialInfoMap.forEach((card, cardKey) => {
                    if (card.cardIndex === groupIndex) {
                        cardsToMove.set(cardKey, card);
                    }
                });
                break;
            }
        }

        if (targetCardId === undefined) {
            console.error(`Card with mesh ${cardMesh} not found in hand.`);
            return;
        }

        // 그룹 내 모든 카드를 필드로 이동
        cardsToMove.forEach((card, key) => {
            // 필드로 이동
            this.handCardInitialInfoMap.delete(key);
            const updatedFieldCardInfo = { ...card, cardIndex }; // 전달받은 cardIndex 사용
            this.fieldCardInitialInfoMap.set(key, updatedFieldCardInfo);
            console.log(`Card ${key} moved to field with index ${cardIndex}.`);
        });

        // 손에 남은 카드들에 대해 인덱스를 재설정 (0부터 순차적으로)
        let handIndex = 0;
        const updatedHandMap = new Map<string, CardInitialInfo>();
        for (const [key, value] of this.handCardInitialInfoMap) {
            const updatedHandCardInfo = { ...value, cardIndex: handIndex };
            updatedHandMap.set(key, updatedHandCardInfo);
            handIndex++;
        }
        this.handCardInitialInfoMap = updatedHandMap;

        console.log("Hand card indices updated after moving a group to the field.");
    }

    static updateHandCardInfo(cardMesh: Mesh<BufferGeometry, Material>, newPosition: Vector2d) {
        for (let [key, value] of this.handCardInitialInfoMap) {
            if (value.cardMesh === cardMesh) {
                value.initialPosition = newPosition;
                this.handCardInitialInfoMap.set(key, value);

                console.log(`Hand card with mesh ${cardMesh} updated with new position.`);
                break;
            }
        }
    }

    static updateFieldCardInfo(cardMesh: Mesh<BufferGeometry, Material>, newPosition: Vector2d) {
        for (let [key, value] of this.fieldCardInitialInfoMap) {
            if (value.cardMesh === cardMesh) {
                value.initialPosition = newPosition;
                this.fieldCardInitialInfoMap.set(key, value);

                console.log(`Field card with mesh ${cardMesh} updated with new position.`);
                break;
            }
        }
    }

    static getHandCardInfo(cardId: string): CardInitialInfo | undefined {
        return this.handCardInitialInfoMap.get(cardId);
    }

    static getAllHandCards(): Map<string, CardInitialInfo> {
        return this.handCardInitialInfoMap;
    }

    static getFieldCardInfo(cardId: string): CardInitialInfo | undefined {
        return this.fieldCardInitialInfoMap.get(cardId);
    }

    static getAllFieldCards(): Map<string, CardInitialInfo> {
        return this.fieldCardInitialInfoMap;
    }
}
