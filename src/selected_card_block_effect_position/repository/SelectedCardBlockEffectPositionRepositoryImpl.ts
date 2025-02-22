import {Vector2d} from "../../common/math/Vector2d";
import {SelectedCardBlockEffectPosition} from "../entity/SelectedCardBlockEffectPosition";
import {SelectedCardBlockEffectPositionRepository} from "./SelectedCardBlockEffectPositionRepository";

export class SelectedCardBlockEffectPositionRepositoryImpl implements SelectedCardBlockEffectPositionRepository {
    private static instance: SelectedCardBlockEffectPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: SelectedCardBlockEffectPosition}> = new Map();;

    private initialX = 0.3885;
    private initialY = 0.36;
    private incrementY = - 0.0706;
    private maxEffectsPerPage = 10; // 스크롤 고려할 것
    private positionIndex = 0;

    private constructor() {}

    public static getInstance(): SelectedCardBlockEffectPositionRepositoryImpl {
        if (!SelectedCardBlockEffectPositionRepositoryImpl.instance) {
            SelectedCardBlockEffectPositionRepositoryImpl.instance = new SelectedCardBlockEffectPositionRepositoryImpl();
        }
        return SelectedCardBlockEffectPositionRepositoryImpl.instance;
    }

    public addSelectedCardBlockEffectPosition(cardId: number): SelectedCardBlockEffectPosition {
        if (this.containsCardIdInMap(cardId) == false) {
            this.positionIndex++;
        }
        const positionX = this.initialX;
        const positionY = this.initialY + (this.positionIndex - 1) * this.incrementY;

        const position = new SelectedCardBlockEffectPosition(positionX, positionY);
        this.positionMap.set(position.id, {cardId, position: position});

        return position;
    }

    public findPositionById(positionId: number): SelectedCardBlockEffectPosition | undefined {
        const position = this.positionMap.get(positionId);
        return position ? position.position : undefined;
    }

    public findPositionByCardId(cardId: number): SelectedCardBlockEffectPosition | null {
        for (const { cardId: storedCardId, position } of this.positionMap.values()) {
            if (storedCardId === cardId) {
                return position;
            }
        }
        return null;
    }

    public findAllPosition(): SelectedCardBlockEffectPosition[] {
        return Array.from(this.positionMap.values()).map(({ position }) => position);
    }

    public deleteById(positionId: number): void {
        this.positionMap.delete(positionId);
        const newPositionMap = new Map<number, { cardId: number, position: SelectedCardBlockEffectPosition }>();
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
