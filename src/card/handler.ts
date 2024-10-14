import {CardKind} from "./kind";
import {CardGenerator} from "./generater";
import {getCardById} from "./utility";
import {Vector2d} from "../common/math/Vector2d";

export class CardGenerationHandler {
    static cardKindHandlers: { [key in CardKind]?: (card: any, positionVector: Vector2d, indexCount: number) => void } = {
        [CardKind.UNIT]: CardGenerator.createUnitCard,
        [CardKind.ITEM]: CardGenerator.createItemCard,
        [CardKind.TRAP]: CardGenerator.createTrapCard,
        [CardKind.SUPPORT]: CardGenerator.createSupportCard,
        [CardKind.TOOL]: CardGenerator.createToolCard,
        [CardKind.ENERGY]: CardGenerator.createEnergyCard,
        [CardKind.ENVIRONMENT]: CardGenerator.createEnvironmentCard,
        [CardKind.TOKEN]: CardGenerator.createTokenCard,
    };

    static createCardById(cardId: number, positionVector: Vector2d, indexCount: number = 0) {
        const card = getCardById(cardId);
        let cardKind;

        if (card) {
            cardKind = card.종류
            const cardKindInt = parseInt(cardKind, 10) as CardKind;
            const handler = CardGenerationHandler.cardKindHandlers[cardKindInt];

            if (handler) {
                return handler(card, positionVector, indexCount);
            } else {
                console.error(`No handler found for card kind: ${cardKindInt}`);
                return null
            }
        }
    }
}