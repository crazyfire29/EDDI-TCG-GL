import {Vector2d} from "../../common/math/Vector2d";
import {MakeDeckScreenCardPosition} from "../entity/MakeDeckScreenCardPosition";
import {MakeDeckScreenCardPositionRepository} from "./MakeDeckScreenCardPositionRepository";

export class MakeDeckScreenCardPositionRepositoryImpl implements MakeDeckScreenCardPositionRepository {
    private static instance: MakeDeckScreenCardPositionRepositoryImpl;
    private positionMap: Map<number, MakeDeckScreenCardPosition>;
    private cardIdToPositionMap: Map<number, number>;

    private initialX = - 0.3605;
    private incrementX = 0.157;
    private incrementXPattern = [0.145, 0.182];
    private initialY =  0.1929;
    private incrementY = - 0.401;
    private maxCardsPerRow = 4;
    private cardsPerPage = 8;

    private constructor() {
        this.positionMap = new Map<number, MakeDeckScreenCardPosition>();
        this.cardIdToPositionMap = new Map<number, number>();
    }

    public static getInstance(): MakeDeckScreenCardPositionRepositoryImpl {
        if (!MakeDeckScreenCardPositionRepositoryImpl.instance) {
            MakeDeckScreenCardPositionRepositoryImpl.instance = new MakeDeckScreenCardPositionRepositoryImpl();
        }
        return MakeDeckScreenCardPositionRepositoryImpl.instance;
    }

    // To-do: x 증가 수정해야 함.
    public addMakeDeckScreenCardPosition(cardIndex: number): MakeDeckScreenCardPosition {
        const positionInPage = (cardIndex - 1) % this.cardsPerPage
        const row = Math.floor(positionInPage / this.maxCardsPerRow);
        const col = (cardIndex - 1) % this.maxCardsPerRow;

        const incrementX = this.incrementXPattern[col % this.incrementXPattern.length];
        const positionX = this.initialX + this.getCumulativeIncrementX(col);
//         const positionX = this.initialX + col * this.incrementX;
        const positionY = this.initialY + row * this.incrementY;

        const position = new MakeDeckScreenCardPosition(positionX, positionY);
        return position;
    }

    private getCumulativeIncrementX(col: number): number {
        let totalIncrement = 0;
        for (let i = 0; i < col; i++) {
            totalIncrement += this.incrementXPattern[i % this.incrementXPattern.length];
        }
        return totalIncrement;
    }

    public save(cardId: number, position: MakeDeckScreenCardPosition): void {
        this.positionMap.set(position.id, position);
        this.cardIdToPositionMap.set(cardId, position.id);
    }

    public findById(positionId: number): MakeDeckScreenCardPosition | undefined {
        return this.positionMap.get(positionId);
    }

    public findAll(): MakeDeckScreenCardPosition[] {
        return Array.from(this.positionMap.values());
    }

    public findPositionByCardId(cardId: number): MakeDeckScreenCardPosition | null {
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
