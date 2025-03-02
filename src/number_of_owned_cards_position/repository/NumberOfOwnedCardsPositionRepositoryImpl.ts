import {Vector2d} from "../../common/math/Vector2d";
import {NumberOfOwnedCardsPosition} from "../entity/NumberOfOwnedCardsPosition";
import {NumberOfOwnedCardsPositionRepository} from "./NumberOfOwnedCardsPositionRepository";

export class NumberOfOwnedCardsPositionRepositoryImpl implements NumberOfOwnedCardsPositionRepository {
    private static instance: NumberOfOwnedCardsPositionRepositoryImpl;
    private positionMap: Map<number, NumberOfOwnedCardsPosition> = new Map();
    private cardIdToPositionMap: Map<number, number> = new Map();

    private initialX = - 0.364;
    private incrementXPattern = [0.145, 0.182];
    private initialY =  0.005;
    private incrementY = - 0.401;
    private maxNumberPerRow = 4;
    private numbersPerPage = 8;

    private constructor() {}

    public static getInstance(): NumberOfOwnedCardsPositionRepositoryImpl {
        if (!NumberOfOwnedCardsPositionRepositoryImpl.instance) {
            NumberOfOwnedCardsPositionRepositoryImpl.instance = new NumberOfOwnedCardsPositionRepositoryImpl();
        }
        return NumberOfOwnedCardsPositionRepositoryImpl.instance;
    }

    public addNumberPosition(cardIndex: number): NumberOfOwnedCardsPosition {
        const positionInPage = (cardIndex - 1) % this.numbersPerPage
        const row = Math.floor(positionInPage / this.maxNumberPerRow);
        const col = (cardIndex - 1) % this.maxNumberPerRow;

        const incrementX = this.incrementXPattern[col % this.incrementXPattern.length];
        const positionX = this.initialX + this.getCumulativeIncrementX(col);
        const positionY = this.initialY + row * this.incrementY;

        const position = new NumberOfOwnedCardsPosition(positionX, positionY);
        return position;
    }

    private getCumulativeIncrementX(col: number): number {
        let totalIncrement = 0;
        for (let i = 0; i < col; i++) {
            totalIncrement += this.incrementXPattern[i % this.incrementXPattern.length];
        }
        return totalIncrement;
    }

    public save(cardId: number, position: NumberOfOwnedCardsPosition): void {
        this.positionMap.set(position.id, position);
        this.cardIdToPositionMap.set(cardId, position.id);
    }

    public findById(positionId: number): NumberOfOwnedCardsPosition | undefined {
        return this.positionMap.get(positionId);
    }

    public findAll(): NumberOfOwnedCardsPosition[] {
        return Array.from(this.positionMap.values());
    }

    public findPositionByCardId(cardId: number): NumberOfOwnedCardsPosition | null {
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
