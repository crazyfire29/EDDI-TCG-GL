import {MyDeckButtonScene} from "../entity/MyDeckButtonScene";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyDeckButtonSceneRepository {
    createMyDeckButtonScene(deckCount: number, position: Vector2d): Promise<MyDeckButtonScene>;
    findById(id: number): MyDeckButtonScene | undefined;
    findAll(): MyDeckButtonScene[];
    deleteById(id: number): boolean;
    deleteAll(): void;
}