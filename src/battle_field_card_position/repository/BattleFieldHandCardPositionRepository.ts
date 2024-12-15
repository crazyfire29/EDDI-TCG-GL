import { BattleFieldCardPosition } from "../entity/BattleFieldCardPosition";

export interface BattleFieldHandCardPositionRepository {
    save(position: BattleFieldCardPosition): void;
    findById(id: number): BattleFieldCardPosition | undefined;
    findAll(): BattleFieldCardPosition[];
    deleteById(id: number): boolean;
    deleteAll(): void;
    count(): number;
}