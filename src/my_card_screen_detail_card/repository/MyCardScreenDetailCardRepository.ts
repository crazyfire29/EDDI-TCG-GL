import * as THREE from 'three';
import {MyCardScreenDetailCard} from "../entity/MyCardScreenDetailCard";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardScreenDetailCardRepository {
    createDetailCard(cardId: number, position: Vector2d): Promise<MyCardScreenDetailCard>;
    findCardByCardId(cardId: number): MyCardScreenDetailCard | null;
    findAllCard(): MyCardScreenDetailCard[];
    findAllCardIdList(): number[];
    deleteAllCard(): void;
}