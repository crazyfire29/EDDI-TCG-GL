import {Vector2d} from "../../common/math/Vector2d";
import {SelectedCardBlockPosition} from "../entity/SelectedCardBlockPosition";
import {SelectedCardBlockPositionRepository} from "./SelectedCardBlockPositionRepository";

export class SelectedCardBlockPositionRepositoryImpl implements SelectedCardBlockPositionRepository {
    private static instance: SelectedCardBlockPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: SelectedCardBlockPosition}> = new Map();;

    private initialX = 0.3895;
    private initialY = 0.36;
    private incrementY = - 0.103;
    private maxBlocksPerPage = 10; // 스크롤 고려할 것
    private positionIndex = 0;

    private constructor() {}

    public static getInstance(): SelectedCardBlockPositionRepositoryImpl {
        if (!SelectedCardBlockPositionRepositoryImpl.instance) {
            SelectedCardBlockPositionRepositoryImpl.instance = new SelectedCardBlockPositionRepositoryImpl();
        }
        return SelectedCardBlockPositionRepositoryImpl.instance;
    }

    public addSelectedCardBlockPosition(cardId: number): SelectedCardBlockPosition {
        if (this.containsCardIdInMap(cardId) == false) {
            this.positionIndex++;
        }
        const positionX = this.initialX;
        const positionY = this.initialY + ((this.positionIndex - 1) % this.maxBlocksPerPage) * this.incrementY;

        const position = new SelectedCardBlockPosition(positionX, positionY);
        this.positionMap.set(position.id, {cardId, position: position});

        return position;
    }

    public findPositionById(positionId: number): SelectedCardBlockPosition | undefined {
        const position = this.positionMap.get(positionId);
        return position ? position.position : undefined;
    }

    public findPositionByCardId(cardId: number): SelectedCardBlockPosition | null {
        for (const { cardId: storedCardId, position } of this.positionMap.values()) {
            if (storedCardId === cardId) {
                return position;
            }
        }
        return null;
    }

    public findAllPosition(): SelectedCardBlockPosition[] {
        return Array.from(this.positionMap.values()).map(({ position }) => position);
    }

    public deleteById(positionId: number): void {
        this.positionMap.delete(positionId);
        const newPositionMap = new Map<number, { cardId: number, position: SelectedCardBlockPosition }>();
        let newPositionId = 0;

        for (const { cardId, position } of this.positionMap.values()) {
            newPositionMap.set(newPositionId++, { cardId, position });
        }

        this.positionMap = newPositionMap;
    }

    public deleteAll(): void {
        this.positionMap.clear();
    }

    public containsCardIdInMap(cardId: number): boolean {
        for (const { cardId: storedCardId } of this.positionMap.values()) {
            if (storedCardId === cardId) {
                return true;
            }
        }
        return false;
    }

    public count(): number {
        return this.positionMap.size;
    }

}
