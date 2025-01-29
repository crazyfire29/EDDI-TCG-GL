import * as THREE from 'three';
import {RaceButton} from "../entity/RaceButton";
import {CardRace} from "../../card/race";
import {Vector2d} from "../../common/math/Vector2d";

export interface RaceButtonRepository {
    createRaceButton(type: CardRace, position: Vector2d): Promise<RaceButton>;
    findById(id: number): RaceButton | null;
    findAll(): RaceButton[];
    deleteById(id: number): void;
    deleteAll(): void;
    findAllButtonIds(): number[];
    hideRaceButton(buttonId: number): void;
    showRaceButton(buttonId: number): void;
}