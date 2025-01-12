import { IdGenerator } from "../../common/id_generator/IdGenerator";
import {Vector2d} from "../../common/math/Vector2d"; // IdGenerator 파일 경로에 맞게 수정하세요

export class NeonBorderLinePosition {
    id: number;
    position: Vector2d;

    constructor(position: Vector2d) {
        this.id = IdGenerator.generateId("NeonBorderLinePosition");
        this.position = position;
    }

    getId(): number {
        return this.id;
    }

    getPosition(): Vector2d {
        return this.position;
    }

    setPosition(position: Vector2d): void {
        this.position = position;
    }
}
