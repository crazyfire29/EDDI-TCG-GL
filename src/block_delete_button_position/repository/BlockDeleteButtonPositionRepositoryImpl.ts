import {Vector2d} from "../../common/math/Vector2d";
import {BlockDeleteButtonPosition} from "../entity/BlockDeleteButtonPosition";
import {BlockDeleteButtonPositionRepository} from "./BlockDeleteButtonPositionRepository";

export class BlockDeleteButtonPositionRepositoryImpl implements BlockDeleteButtonPositionRepository {
    private static instance: BlockDeleteButtonPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: BlockDeleteButtonPosition }> = new Map(); // position unique id: {card id: mesh}

    private positionX = 0.4682;

    private constructor() {}

    public static getInstance(): BlockDeleteButtonPositionRepositoryImpl {
        if (!BlockDeleteButtonPositionRepositoryImpl.instance) {
            BlockDeleteButtonPositionRepositoryImpl.instance = new BlockDeleteButtonPositionRepositoryImpl();
        }
        return BlockDeleteButtonPositionRepositoryImpl.instance;
    }

    public addBlockDeleteButtonPosition(cardId: number, buttonPositionY: number): BlockDeleteButtonPosition {
        const positionX = this.positionX;
        const positionY = buttonPositionY;
        const newPosition = new BlockDeleteButtonPosition(positionX, positionY);
        this.positionMap.set(newPosition.id, { cardId, position: newPosition });

        return newPosition;
    }

    public findPositionByPositionId(positionId: number): BlockDeleteButtonPosition | null {
        const position = this.positionMap.get(positionId);
        if (position) {
            return position.position;
        } else {
            return null;
        }
    }

    public findPositionByCardId(cardId: number): BlockDeleteButtonPosition | null {
        for (const { cardId: storedCardId, position } of this.positionMap.values()) {
            if (storedCardId === cardId) {
                return position;
            }
        }
        return null;
    }

    public findAll(): BlockDeleteButtonPosition[] {
        return Array.from(this.positionMap.values()).map(({ position }) => position);
    }

    public findPositionIdByCardId(cardId: number): number | null {
        for (const [positionId, { cardId: storedCardId }] of this.positionMap.entries()) {
            if (storedCardId === cardId) {
                return positionId;
            }
        }
        return null;
    }

    public deleteAll(): void {
        this.positionMap.clear();
    }

    public deleteByPositionId(positionId: number): void {
        this.positionMap.delete(positionId);

        const newPositionMap = new Map<number, { cardId: number, position: BlockDeleteButtonPosition }>();
        let newPosition = 0;

        for (const { cardId, position } of this.positionMap.values()) {
            newPositionMap.set(newPosition++, { cardId, position });
        }

        this.positionMap = newPositionMap;
    }

    count(): number {
        return this.positionMap.size;
    }
}
