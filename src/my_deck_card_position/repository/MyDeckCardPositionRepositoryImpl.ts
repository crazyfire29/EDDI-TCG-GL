import {Vector2d} from "../../common/math/Vector2d";
import {MyDeckCardPosition} from "../entity/MyDeckCardPosition";
import {MyDeckCardPositionRepository} from "./MyDeckCardPositionRepository";

export class MyDeckCardPositionRepositoryImpl implements MyDeckCardPositionRepository {
    private static instance: MyDeckCardPositionRepositoryImpl;
    private positionMap: Map<number, MyDeckCardPosition>;
    private cardIdToPositionMap: Map<number, number>;
    private deckToPositionMap: Map<number, Map<number, MyDeckCardPosition>> = new Map(); // dekId: [cardId: position] 형태로 관리

    private initialX = - 0.3985;
    private incrementX = 0.167;
    private initialY =  0.1929;
    private incrementY = - 0.411;
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

    public savePositionInfo(deckId: number, positionInfoMap: Map<number, MyDeckCardPosition>): void {
        if (!this.deckToPositionMap.has(deckId)){
            this.deckToPositionMap.set(deckId, new Map());
        }

        const deckPositionMap = this.deckToPositionMap.get(deckId)!;
        positionInfoMap.forEach((position, cardId) => {
            deckPositionMap.set(cardId, position);
        });
    }

    public initialPositionMap(): void {
        this.positionMap.clear();
        this.cardIdToPositionMap.clear();
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

    // 덱 id에 해당되는 모든 position 객체 불러오기
    public findCardPositionByDeckId(deckId: number): MyDeckCardPosition[] {
        const cardPositionMap = this.deckToPositionMap.get(deckId);
        if (!cardPositionMap) return [];

        return Array.from(cardPositionMap.values());
    }

    // 특정 덱 id에 해당되는 특정 card의 position 불러오기
    public findPositionByDeckIdAndCardId(deckId: number, cardId: number): MyDeckCardPosition | null {
        const cardPositionMap = this.deckToPositionMap.get(deckId);
        if (!cardPositionMap) {
            console.warn(`[WARN] Deck with ID ${deckId} not found`);
            return null;
        }

        const position = cardPositionMap.get(cardId);
        if (!position) {
            console.warn(`[WARN] Card Position with Card ID ${cardId} not found in deck ${deckId}`);
            return null;
        }

        return position;
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
