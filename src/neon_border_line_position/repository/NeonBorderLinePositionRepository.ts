import { NeonBorderLinePosition } from "../entity/NeonBorderLinePosition";

export interface NeonBorderLinePositionRepository {
    save(neonBorderLinePosition: NeonBorderLinePosition): void;
    findById(id: number): NeonBorderLinePosition | null;
    findAll(): NeonBorderLinePosition[];
    deleteById(id: number): void;
    deleteAll(): void;
}
