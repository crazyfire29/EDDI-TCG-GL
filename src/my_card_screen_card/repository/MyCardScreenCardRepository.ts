import * as THREE from 'three';
import {MyCardScreenCard} from "../entity/MyCardScreenCard";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardScreenCardRepository {
    createMyCardScreenCard(cardId: number, cardCount: number, position: Vector2d): Promise<MyCardScreenCard>;
    findCardByCardId(cardId: number): MyCardScreenCard | null;
    findAllCard(): MyCardScreenCard[];
    findAllCardIdList(): number[];
    findCardCountByCardId(cardId: number): number | null;
    findCardListByRaceId(raceId: string): MyCardScreenCard[] | null;
    deleteAllCard(): void;
}