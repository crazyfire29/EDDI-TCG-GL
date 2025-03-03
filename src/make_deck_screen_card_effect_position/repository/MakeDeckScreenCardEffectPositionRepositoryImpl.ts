import {Vector2d} from "../../common/math/Vector2d";
import {MakeDeckScreenCardEffectPosition} from "../entity/MakeDeckScreenCardEffectPosition";
import {MakeDeckScreenCardEffectPositionRepository} from "./MakeDeckScreenCardEffectPositionRepository";

export class MakeDeckScreenCardEffectPositionRepositoryImpl implements MakeDeckScreenCardEffectPositionRepository {
    private static instance: MakeDeckScreenCardEffectPositionRepositoryImpl;
    private positionMap: Map<number, MakeDeckScreenCardEffectPosition>;
    private cardIdToPositionMap: Map<number, number>;

    private initialX = - 0.3605;
    private incrementX = 0.157;
    private incrementXPattern = [0.145, 0.182];
    private initialY =  0.1929;
    private incrementY = - 0.401;
    private maxEffectsPerRow = 4;
    private effectsPerPage = 8;

    private constructor() {
        this.positionMap = new Map<number, MakeDeckScreenCardEffectPosition>();
        this.cardIdToPositionMap = new Map<number, number>();
    }

    public static getInstance(): MakeDeckScreenCardEffectPositionRepositoryImpl {
        if (!MakeDeckScreenCardEffectPositionRepositoryImpl.instance) {
            MakeDeckScreenCardEffectPositionRepositoryImpl.instance = new MakeDeckScreenCardEffectPositionRepositoryImpl();
        }
        return MakeDeckScreenCardEffectPositionRepositoryImpl.instance;
    }

    public addMakeDeckScreenCardEffectPosition(cardIndex: number): MakeDeckScreenCardEffectPosition {
        const positionInPage = (cardIndex - 1) % this.effectsPerPage;
        const row = Math.floor(positionInPage / this.maxEffectsPerRow);
        const col = (cardIndex - 1) % this.maxEffectsPerRow;

        const incrementX = this.incrementXPattern[col % this.incrementXPattern.length];
        const positionX = this.initialX + this.getCumulativeIncrementX(col);
        const positionY = this.initialY + row * this.incrementY;

        const position = new MakeDeckScreenCardEffectPosition(positionX, positionY);
        return position;
    }

    private getCumulativeIncrementX(col: number): number {
        let totalIncrement = 0;
        for (let i = 0; i < col; i++) {
            totalIncrement += this.incrementXPattern[i % this.incrementXPattern.length];
        }
        return totalIncrement;
    }

    public save(cardId: number, position: MakeDeckScreenCardEffectPosition): void {
        this.positionMap.set(position.id, position);
        this.cardIdToPositionMap.set(cardId, position.id);
    }

    public findById(positionId: number): MakeDeckScreenCardEffectPosition | undefined {
        return this.positionMap.get(positionId);
    }

    public findAll(): MakeDeckScreenCardEffectPosition[] {
        return Array.from(this.positionMap.values());
    }

    public findPositionByCardId(cardId: number): MakeDeckScreenCardEffectPosition | null {
        const positionId = this.cardIdToPositionMap.get(cardId);
        if (positionId === undefined) {
            return null;
        }
        return this.positionMap.get(positionId) || null;
    }

    deleteById(positionId: number): void {
        this.positionMap.delete(positionId);
    }

    deleteAll(): void {
        this.positionMap.clear();
        this.cardIdToPositionMap.clear();
    }

    count(): number {
        return this.positionMap.size;
    }
}
