import {Background} from "../entity/Background";
import {BackgroundType} from "../entity/BackgroundType";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export interface BackgroundRepository {
    createBackground(
        textureName: string,
        type: BackgroundType,
        width: number,
        height: number
    ): Promise<NonBackgroundImage>;
    save(background: Background): void;
    findById(id: number): Background | null;
    findAll(): Background[];
    deleteById(id: number): void;
    deleteAll(): void;
}