import {NeonBorderLineScene} from "../entity/NeonBorderLineScene";

export interface NeonBorderLineSceneRepository {
    save(neonBorderLineScene: NeonBorderLineScene): void;
    findById(id: number): NeonBorderLineScene | null;
    findAll(): NeonBorderLineScene[];
    deleteById(id: number): void;
    deleteAll(): void;
}
