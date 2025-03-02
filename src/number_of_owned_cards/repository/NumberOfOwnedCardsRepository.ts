import * as THREE from 'three';
import {NumberOfOwnedCards} from "../entity/NumberOfOwnedCards";
import {Vector2d} from "../../common/math/Vector2d";

export interface NumberOfOwnedCardsRepository {
    createNumberOfOwnedCards(cardId: number, cardCount: number, position: Vector2d): Promise<NumberOfOwnedCards>;
    findNumberByCardId(cardId: number): NumberOfOwnedCards | null;
    findAllNumber(): NumberOfOwnedCards[];
    deleteAllNumber(): void;
}