import {NeonBorder} from "../entity/NeonBorder";

export interface NeonBorderRepository {
    save(neonBorder: NeonBorder): NeonBorder;
    findById(id: number): NeonBorder | null;
    findAll(): NeonBorder[];
    deleteById(id: number): void;
    deleteAll(): void;
}
