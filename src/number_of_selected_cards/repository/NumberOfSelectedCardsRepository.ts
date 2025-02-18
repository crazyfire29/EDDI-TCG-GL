import * as THREE from 'three';
import {NumberOfSelectedCards} from "../entity/NumberOfSelectedCards";
import {Vector2d} from "../../common/math/Vector2d";

export interface NumberOfSelectedCardsRepository {
    createNumberOfSelectedCards(clickedCardId: number, cardCount: number, position: Vector2d): Promise<NumberOfSelectedCards>;
    findNumberByCardIdAndCardCount(clickedCardId: number, cardCount: number): NumberOfSelectedCards | null;
    findAllNumber(): NumberOfSelectedCards[];
    deleteAllNumber(): void;
}