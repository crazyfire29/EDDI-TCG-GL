import {MyDeckNameTextPosition} from "../entity/MyDeckNameTextPosition";

export interface MyDeckNameTextPositionRepository {
    save(deckId: number, position: MyDeckNameTextPosition): void;
    findById(id: number): MyDeckNameTextPosition | undefined;
    findAll(): MyDeckNameTextPosition[];
    deleteById(id: number): boolean;
    deleteAll(): void;
    count(): number;
}