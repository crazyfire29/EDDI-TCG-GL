import {Vector2d} from "../../common/math/Vector2d";
import {MyDeckNameTextPosition} from "../entity/MyDeckNameTextPosition";
import {MyDeckNameTextPositionRepository} from "./MyDeckNameTextPositionRepository";

export class MyDeckNameTextPositionRepositoryImpl implements MyDeckNameTextPositionRepository {
    private static instance: MyDeckNameTextPositionRepositoryImpl;
    private positionMap: Map<number, MyDeckNameTextPosition>;
    private deckToPositionMap: Map<number, number>;

    private initialX = 0.3268;
    private initialY = 0.22242;
    private incrementY = - 0.103;
    private maxNameTextsPerPage = 6;

    private constructor() {
        this.positionMap = new Map<number, MyDeckNameTextPosition>();
        this.deckToPositionMap = new Map<number, number>();
    }

    public static getInstance(): MyDeckNameTextPositionRepositoryImpl {
        if (!MyDeckNameTextPositionRepositoryImpl.instance) {
            MyDeckNameTextPositionRepositoryImpl.instance = new MyDeckNameTextPositionRepositoryImpl();
        }
        return MyDeckNameTextPositionRepositoryImpl.instance;
    }

    public addMyDeckNameTextPosition(deckId: number): MyDeckNameTextPosition {
        const positionX = this.initialX;
        const positionY = this.initialY + ((deckId - 1) % this.maxNameTextsPerPage) * this.incrementY;

        const position = new MyDeckNameTextPosition(positionX, positionY);
        return position;
    }

    save(deckId: number, position: MyDeckNameTextPosition): void {
        this.positionMap.set(position.id, position);
        this.deckToPositionMap.set(deckId, position.id);
    }

    findById(id: number): MyDeckNameTextPosition | undefined {
        return this.positionMap.get(id);
    }

    findAll(): MyDeckNameTextPosition[] {
        return Array.from(this.positionMap.values());
    }

    public findPositionByDeckId(deckId: number): MyDeckNameTextPosition | null {
        const positionId = this.deckToPositionMap.get(deckId);
        if (positionId === undefined) {
            return null;
        }
        return this.positionMap.get(positionId) || null;
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
