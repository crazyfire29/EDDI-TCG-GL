import {MouseCursorDetectArea} from "../entity/MouseCursorDetectArea";

export interface MouseCursorDetectRepository {
    detectArea(mouseX: number, mouseY: number): MouseCursorDetectArea | null;
}
