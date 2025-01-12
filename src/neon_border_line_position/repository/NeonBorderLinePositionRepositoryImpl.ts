import { NeonBorderLinePosition } from "../entity/NeonBorderLinePosition";
import { NeonBorderLinePositionRepository } from "./NeonBorderLinePositionRepository";

export class NeonBorderLinePositionRepositoryImpl implements NeonBorderLinePositionRepository {
    private positions: NeonBorderLinePosition[] = [];

    save(neonBorderLinePosition: NeonBorderLinePosition): void {
        const index = this.positions.findIndex(position => position.id === neonBorderLinePosition.id);
        if (index !== -1) {
            // Update existing position
            this.positions[index] = neonBorderLinePosition;
        } else {
            // Add new position
            this.positions.push(neonBorderLinePosition);
        }
    }

    findById(id: number): NeonBorderLinePosition | null {
        return this.positions.find(position => position.id === id) || null;
    }

    findAll(): NeonBorderLinePosition[] {
        return [...this.positions];
    }

    deleteById(id: number): void {
        this.positions = this.positions.filter(position => position.id !== id);
    }

    deleteAll(): void {
        this.positions = [];
    }
}
