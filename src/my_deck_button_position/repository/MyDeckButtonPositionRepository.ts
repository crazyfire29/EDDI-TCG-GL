import { MyDeckButtonPosition } from "../entity/MyDeckButtonPosition";

export interface MyDeckButtonPositionRepository {
    save(position: MyDeckButtonPosition): void;
    findById(id: number): MyDeckButtonPosition | undefined;
    findAll(): MyDeckButtonPosition[];
    deleteById(id: number): boolean;
    deleteAll(): void;
    count(): number;
}