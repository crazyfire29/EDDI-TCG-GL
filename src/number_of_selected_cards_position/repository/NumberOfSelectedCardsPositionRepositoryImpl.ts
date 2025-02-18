import {Vector2d} from "../../common/math/Vector2d";
import {NumberOfSelectedCardsPosition} from "../entity/NumberOfSelectedCardsPosition";
import {NumberOfSelectedCardsPositionRepository} from "./NumberOfSelectedCardsPositionRepository";

export class NumberOfSelectedCardsPositionRepositoryImpl implements NumberOfSelectedCardsPositionRepository {
    private static instance: NumberOfSelectedCardsPositionRepositoryImpl;
    private positionMap: Map<number, NumberOfSelectedCardsPosition>; //positionId: position
    private cardIdToPositionMap: Map<number, number>; //clickedCardId: positionId

    private positionX = 0.2772;

    private constructor() {
        this.positionMap = new Map<number, NumberOfSelectedCardsPosition>();
        this.cardIdToPositionMap = new Map<number, number>();
    }

    public static getInstance(): NumberOfSelectedCardsPositionRepositoryImpl {
        if (!NumberOfSelectedCardsPositionRepositoryImpl.instance) {
            NumberOfSelectedCardsPositionRepositoryImpl.instance = new NumberOfSelectedCardsPositionRepositoryImpl();
        }
        return NumberOfSelectedCardsPositionRepositoryImpl.instance;
    }

    public addNumberOfSelectedCardsPosition(cardId: number, blockPositionY: number): NumberOfSelectedCardsPosition {
        const positionX = this.positionX;
        const positionY = blockPositionY;
        const position = new NumberOfSelectedCardsPosition(positionX, positionY);

        this.positionMap.set(position.id, position);
        this.cardIdToPositionMap.set(cardId, position.id);

        return position;
    }

    public findById(positionId: number): NumberOfSelectedCardsPosition | undefined {
        return this.positionMap.get(positionId);
    }

    public findAll(): NumberOfSelectedCardsPosition[] {
        return Array.from(this.positionMap.values());
    }

    public findPositionByCardId(cardId: number): NumberOfSelectedCardsPosition | null {
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
