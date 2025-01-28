import * as THREE from 'three';
import {MakeDeckScreenCard} from "../entity/MakeDeckScreenCard";
import {Vector2d} from "../../common/math/Vector2d";

export interface MakeDeckScreenCardRepository {
    createMakeDeckScreenCard(cardId: number, position: Vector2d): Promise<MakeDeckScreenCard>;
    findCardByCardId(cardId: number): MakeDeckScreenCard | null;
    findAllCard(): MakeDeckScreenCard[];
    findCardsByRaceId(raceId: string): MakeDeckScreenCard[] | null;
    deleteAllCard(): void;
}