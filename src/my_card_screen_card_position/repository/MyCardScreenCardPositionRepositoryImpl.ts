import {Vector2d} from "../../common/math/Vector2d";
import {MyCardScreenCardPosition} from "../entity/MyCardScreenCardPosition";
import {MyCardScreenCardPositionRepository} from "./MyCardScreenCardPositionRepository";

export class MyCardScreenCardPositionRepositoryImpl implements MyCardScreenCardPositionRepository {
    private static instance: MyCardScreenCardPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: MyCardScreenCardPosition }>;

    private initialX = - 0.311;
    private incrementX = 0.177;
    private initialY =  0.1;
    private incrementY = - 0.491;
    private maxCardsPerRow = 5;
    private cardsPerPage = 10;

    private constructor() {
        this.positionMap = new Map<number, { cardId: number, position: MyCardScreenCardPosition }>();
    }

    public static getInstance(): MyCardScreenCardPositionRepositoryImpl {
        if (!MyCardScreenCardPositionRepositoryImpl.instance) {
            MyCardScreenCardPositionRepositoryImpl.instance = new MyCardScreenCardPositionRepositoryImpl();
        }
        return MyCardScreenCardPositionRepositoryImpl.instance;
    }

    public addMyCardScreenCardPosition(cardId: number, cardIndex: number): MyCardScreenCardPosition {
//         const positionInPage = (cardIndex - 1) % this.cardsPerPage; // 현재 페이지에서 몇 번째인지.
//         const col = positionInPage % this.maxCardsPerRow; // 0~4 (열)
//         const row = Math.floor(positionInPage / this.maxCardsPerRow); // 0~1 (행)

        const col = (cardIndex - 1) % this.maxCardsPerRow;
        const row = Math.floor((cardIndex - 1) / this.maxCardsPerRow); // 줄 개수 증가

        const positionX = this.initialX + col * this.incrementX;
        const positionY = this.initialY + row * this.incrementY;

        const newPosition = new MyCardScreenCardPosition(positionX, positionY);
        this.positionMap.set(newPosition.id, { cardId, position: newPosition });

        return newPosition;
    }

    public findPositionByPositionId(positionId: number): MyCardScreenCardPosition | null {
        const position = this.positionMap.get(positionId);
        if (position) {
            return position.position;
        } else {
            return null;
        }
    }

    public findPositionByCardId(cardId: number): MyCardScreenCardPosition | null {
       for (const { cardId: storedCardId, position } of this.positionMap.values()) {
           if (storedCardId === cardId) {
               return position;
           }
       }
       return null;
    }

    public findAll(): MyCardScreenCardPosition[] {
        return Array.from(this.positionMap.values()).map(({ position }) => position);
    }

    public deleteByPositionId(positionId: number): void {
        this.positionMap.delete(positionId);
    }

    public deleteAll(): void {
        this.positionMap.clear();
    }

    public count(): number {
        return this.positionMap.size;
    }
}
