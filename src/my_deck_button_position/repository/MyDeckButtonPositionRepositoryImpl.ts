import {Vector2d} from "../../common/math/Vector2d";
import { MyDeckButtonPosition } from "../entity/MyDeckButtonPosition";
import { MyDeckButtonPositionRepository } from "./MyDeckButtonPositionRepository";

export class MyDeckButtonPositionRepositoryImpl implements MyDeckButtonPositionRepository {
    private static instance: MyDeckButtonPositionRepositoryImpl;
    private positionMap: Map<number, MyDeckButtonPosition>;


    private initialX = 0.3268;
    private initialY = 0.22242;
    private incrementY = - 0.103;
    private maxButtonsPerPage = 6;

    private constructor() {
        this.positionMap = new Map<number, MyDeckButtonPosition>();
    }

    public static getInstance(): MyDeckButtonPositionRepositoryImpl {
        if (!MyDeckButtonPositionRepositoryImpl.instance) {
            MyDeckButtonPositionRepositoryImpl.instance = new MyDeckButtonPositionRepositoryImpl();
        }
        return MyDeckButtonPositionRepositoryImpl.instance;
    }

    public addMyDeckButtonPosition(deckId: number): MyDeckButtonPosition {
        const positionX = this.initialX;
        const positionY = this.initialY + ((deckId - 1) % this.maxButtonsPerPage) * this.incrementY;

        const position = new MyDeckButtonPosition(positionX, positionY);
        position.id = deckId;

        return position;
    }

    save(deckId: number, position: MyDeckButtonPosition): void {
        this.positionMap.set(deckId, position);
    }

    findById(id: number): MyDeckButtonPosition | undefined {
        return this.positionMap.get(id);
    }

    findAll(): MyDeckButtonPosition[] {
        return Array.from(this.positionMap.values());
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
