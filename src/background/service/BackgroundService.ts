import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export interface BackgroundService {
    createBackground(
        textureName: string,
        type: number,
        width: number,
        height: number
    ): Promise<NonBackgroundImage | null>;
}