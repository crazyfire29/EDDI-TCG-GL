import * as THREE from 'three';
import {MyCardRaceButton} from "../entity/MyCardRaceButton";
import {CardRace} from "../../card/race";
import {Vector2d} from "../../common/math/Vector2d";

export interface MyCardRaceButtonRepository {
    createRaceButton(type: CardRace, position: Vector2d): Promise<MyCardRaceButton>;
    findButtonById(id: number): MyCardRaceButton | null;
    findAllButton(): MyCardRaceButton[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllButtonIds(): number[];
    hideButton(buttonId: number): void;
    showButton(buttonId: number): void;
}