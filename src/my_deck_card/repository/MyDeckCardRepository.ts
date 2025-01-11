import * as THREE from 'three';
import {MyDeckCard} from "../entity/MyDeckCard";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckCardRepository {
    createMyDeckCardScene(cardId: number, position: Vector2d): Promise<MyDeckCard>;
    saveMyDeckCardSceneInfo(deckId: number, cardMeshMap: Map<number, THREE.Mesh>): void;
    saveNumberOfCards(cardIdList: number[]): Map<number, number>;

    findCardByCardId(cardId: number): MyDeckCard | null;
    findAllCard(): MyDeckCard[];
    findCardMeshesByDeckId(deckId: number): THREE.Mesh[];
    findCardMeshByDeckIdAndCardId(deckId: number, cardId: number): THREE.Mesh | null;

    initialCardMap(): void;
    deleteCardByCardId(cardId: number): void;
    deleteAllCard(): void;
    deleteCardsByDeckId(deckId: number): void;
}