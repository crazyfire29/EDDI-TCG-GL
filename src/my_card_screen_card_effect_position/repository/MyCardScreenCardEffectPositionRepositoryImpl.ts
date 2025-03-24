import {Vector2d} from "../../common/math/Vector2d";
import {MyCardScreenCardEffectPosition} from "../entity/MyCardScreenCardEffectPosition";
import {MyCardScreenCardEffectPositionRepository} from "./MyCardScreenCardEffectPositionRepository";

export class MyCardScreenCardEffectPositionRepositoryImpl implements MyCardScreenCardEffectPositionRepository {
    private static instance: MyCardScreenCardEffectPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: MyCardScreenCardEffectPosition }>;

    private initialX = - 0.2935;
    private incrementX = 0.162;
    private initialY =  0.14;
    private incrementY = - 0.481;
    private maxEffectsPerRow = 5;
    private effectsPerPage = 10;

    private constructor() {
        this.positionMap = new Map<number, { cardId: number, position: MyCardScreenCardEffectPosition }>();
    }

    public static getInstance(): MyCardScreenCardEffectPositionRepositoryImpl {
        if (!MyCardScreenCardEffectPositionRepositoryImpl.instance) {
            MyCardScreenCardEffectPositionRepositoryImpl.instance = new MyCardScreenCardEffectPositionRepositoryImpl();
        }
        return MyCardScreenCardEffectPositionRepositoryImpl.instance;
    }

    public addMyCardScreenCardEffectPosition(cardId: number, cardIndex: number): MyCardScreenCardEffectPosition {
//         const positionInPage = (cardIndex - 1) % this.effectsPerPage; // 현재 페이지에서 몇 번째인지.
//         const col = positionInPage % this.maxEffectsPerRow; // 0~4 (열)
//         const row = Math.floor(positionInPage / this.maxEffectsPerRow); // 0~1 (행)

        const col = (cardIndex - 1) % this.maxEffectsPerRow;
        const row = Math.floor((cardIndex - 1) / this.maxEffectsPerRow); // 줄 개수 증가

        const positionX = this.initialX + col * this.incrementX;
        const positionY = this.initialY + row * this.incrementY;

        const newPosition = new MyCardScreenCardEffectPosition(positionX, positionY);
        this.positionMap.set(newPosition.id, { cardId, position: newPosition });

        return newPosition;
    }

    public findPositionByPositionId(positionId: number): MyCardScreenCardEffectPosition | null {
        const position = this.positionMap.get(positionId);
        if (position) {
            return position.position;
        } else {
            return null;
        }
    }

    public findPositionByCardId(cardId: number): MyCardScreenCardEffectPosition | null {
       for (const { cardId: storedCardId, position } of this.positionMap.values()) {
           if (storedCardId === cardId) {
               return position;
           }
       }
       return null;
    }

    public findAll(): MyCardScreenCardEffectPosition[] {
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
