import {NeonBorder} from "../entity/NeonBorder";
import {NeonBorderSceneType} from "../entity/NeonBorderSceneType";

export interface NeonBorderRepository {
    save(neonBorder: NeonBorder): NeonBorder;
    findById(id: number): NeonBorder | null;
    findAll(): NeonBorder[];
    deleteById(id: number): void;
    deleteAll(): void;

    findByCardSceneId(cardSceneId: number): NeonBorder | null;
    findByCardSceneIdWithPlacement(sceneId: number, type: NeonBorderSceneType): NeonBorder | null;
}
