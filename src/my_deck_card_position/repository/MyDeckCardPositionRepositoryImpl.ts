import {Vector2d} from "../../common/math/Vector2d";
import {MyDeckCardPosition} from "../entity/MyDeckCardPosition";
import {MyDeckCardPositionRepository} from "./MyDeckCardPositionRepository";

export class MyDeckCardPositionRepositoryImpl implements MyDeckCardPositionRepository {
    private static instance: MyDeckCardPositionRepositoryImpl;
    private positionMap: Map<number, MyDeckCardPosition>;
    private cardIdToPositionMap: Map<number, number>;

    private initialX = - 0.3985;
    private incrementX = 0.167;
    private initialY = - 0.1929;
    private incrementY = 0.411;
    private maxCardsPerRow = 4;
    private cardsPerPage = 8;

    private constructor() {
        this.positionMap = new Map<number, MyDeckCardPosition>();
        this.cardIdToPositionMap = new Map<number, number>();
    }

    public static getInstance(): MyDeckCardPositionRepositoryImpl {
        if (!MyDeckCardPositionRepositoryImpl.instance) {
            MyDeckCardPositionRepositoryImpl.instance = new MyDeckCardPositionRepositoryImpl();
        }
        return MyDeckCardPositionRepositoryImpl.instance;
    }

    public addMyDeckCardPosition(cardIndex: number): MyDeckCardPosition {
        const positionInPage = (cardIndex - 1) % this.cardsPerPage
        const row = Math.floor(positionInPage / this.maxCardsPerRow);
        const col = (cardIndex - 1) % this.maxCardsPerRow;

        const positionX = this.initialX + col * this.incrementX;
        const positionY = this.initialY + row * this.incrementY;

        const position = new MyDeckCardPosition(positionX, positionY);
        return position;
    }

    public save(cardId: number, position: MyDeckCardPosition): void {
        this.positionMap.set(position.id, position);
        this.cardIdToPositionMap.set(cardId, position.id);
    }

    public findById(positionId: number): MyDeckCardPosition | undefined {
        return this.positionMap.get(positionId);
    }

    public findAll(): MyDeckCardPosition[] {
        return Array.from(this.positionMap.values());
    }

    public findPositionByCardId(cardId: number): MyDeckCardPosition | null {
        const positionId = this.cardIdToPositionMap.get(cardId);
        if (positionId === undefined) {
            return null;
        }
        return this.positionMap.get(positionId) || null;
    }

    deleteById(positionId: number): boolean {
        return this.positionMap.delete(positionId);
    }

    deleteAll(): void {
        this.positionMap.clear();
        this.cardIdToPositionMap.clear();
    }

    count(): number {
        return this.positionMap.size;
    }
}
