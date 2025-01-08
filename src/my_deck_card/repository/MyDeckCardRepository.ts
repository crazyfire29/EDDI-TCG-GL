import * as THREE from 'three';
import {MyDeckCard} from "../entity/MyDeckCard";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckCardRepository {
    createMyDeckCard(cardId: number, position: Vector2d): Promise<MyDeckCard>;
    findById(cardId: number): MyDeckCard | null;
    findAll(): MyDeckCard[];
    deleteById(cardId: number): void;
    deleteAll(): void;
}