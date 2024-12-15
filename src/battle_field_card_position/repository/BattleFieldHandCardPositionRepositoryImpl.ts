import { BattleFieldCardPosition } from "../entity/BattleFieldCardPosition";
import { BattleFieldHandCardPositionRepository } from "./BattleFieldHandCardPositionRepository";

export class BattleFieldHandCardPositionRepositoryImpl implements BattleFieldHandCardPositionRepository {
    private static instance: BattleFieldHandCardPositionRepositoryImpl;
    private positionMap: Map<number, BattleFieldCardPosition>;

    private constructor() {
        this.positionMap = new Map<number, BattleFieldCardPosition>();
    }

    public static getInstance(): BattleFieldHandCardPositionRepositoryImpl {
        if (!BattleFieldHandCardPositionRepositoryImpl.instance) {
            BattleFieldHandCardPositionRepositoryImpl.instance = new BattleFieldHandCardPositionRepositoryImpl();
        }
        return BattleFieldHandCardPositionRepositoryImpl.instance;
    }

    save(position: BattleFieldCardPosition): void {
        this.positionMap.set(position.id, position);
    }

    findById(id: number): BattleFieldCardPosition | undefined {
        return this.positionMap.get(id);
    }

    findAll(): BattleFieldCardPosition[] {
        return Array.from(this.positionMap.values());
    }

    deleteById(id: number): boolean {
        return this.positionMap.delete(id);
    }

    deleteAll(): void {
        this.positionMap.clear();
    }

    count(): number {
        return this.positionMap.size;
    }
}
