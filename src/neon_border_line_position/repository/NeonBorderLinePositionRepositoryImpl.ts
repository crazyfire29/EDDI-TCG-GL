import { NeonBorderLinePosition } from "../entity/NeonBorderLinePosition";
import { NeonBorderLinePositionRepository } from "./NeonBorderLinePositionRepository";

export class NeonBorderLinePositionRepositoryImpl implements NeonBorderLinePositionRepository {
    private static instance: NeonBorderLinePositionRepositoryImpl | null = null; // 싱글톤 인스턴스
    private positions: NeonBorderLinePosition[] = [];

    private constructor() {} // 외부에서 생성하지 못하도록 private

    public static getInstance(): NeonBorderLinePositionRepositoryImpl {
        if (!NeonBorderLinePositionRepositoryImpl.instance) {
            NeonBorderLinePositionRepositoryImpl.instance = new NeonBorderLinePositionRepositoryImpl();
        }
        return NeonBorderLinePositionRepositoryImpl.instance;
    }

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
