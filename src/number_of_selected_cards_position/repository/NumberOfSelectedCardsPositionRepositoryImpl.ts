import {Vector2d} from "../../common/math/Vector2d";
import {NumberOfSelectedCardsPosition} from "../entity/NumberOfSelectedCardsPosition";
import {NumberOfSelectedCardsPositionRepository} from "./NumberOfSelectedCardsPositionRepository";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";

export class NumberOfSelectedCardsPositionRepositoryImpl implements NumberOfSelectedCardsPositionRepository {
    private static instance: NumberOfSelectedCardsPositionRepositoryImpl;
//     private positionMap: Map<number, NumberOfSelectedCardsPosition>; //positionId: position
//     private cardIdToPositionMap: Map<number, number>; //clickedCardId: positionId
    private positionMap: Map<number, { cardId: number, position: NumberOfSelectedCardsPosition}> = new Map();
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;

    private positionX = 0.2772;

    private constructor() {
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
//         this.positionMap = new Map<number, NumberOfSelectedCardsPosition>();
//         this.cardIdToPositionMap = new Map<number, number>();
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

//         this.positionMap.set(position.id, position);
//         this.cardIdToPositionMap.set(cardId, position.id);
        this.positionMap.set(position.id, {cardId, position: position});

        return position;
    }

    public findById(positionId: number): NumberOfSelectedCardsPosition | undefined {
        const position = this.positionMap.get(positionId);
        return position ? position.position : undefined;
    }

    public findAll(): NumberOfSelectedCardsPosition[] {
        return Array.from(this.positionMap.values()).map(({ position }) => position);
    }

    public findPositionByCardId(cardId: number): NumberOfSelectedCardsPosition | null {
        for (const { cardId: storedCardId, position } of this.positionMap.values()) {
            if (storedCardId === cardId) {
                return position;
            }
        }
        return null;
    }

    public findPositionIdByCardId(cardId: number): number | null {
        for (const [positionId, { cardId: storedCardId }] of this.positionMap.entries()) {
            if (storedCardId === cardId) {
                return positionId;
            }
        }
        return null;
    }

    deleteById(positionId: number): void {
        this.positionMap.delete(positionId);
        const updatedPositionMap = new Map<number, { cardId: number, position: NumberOfSelectedCardsPosition }>();

        for (const [key, { cardId, position }] of this.positionMap.entries()) {
            const newPositionY = this.getSelectedCardBlockPositionY(cardId);
            if (newPositionY) {
                position.setPosition(this.positionX, newPositionY);
                updatedPositionMap.set(key, { cardId, position }); // 기존 key 유지하면서 값 업데이트
                console.log(`카드: ${cardId}, 재정렬된 위치: ${position.getY()}`);
            }
        }
        this.positionMap = updatedPositionMap; // 업데이트된 맵을 적용
    }

    deleteAll(): void {
        this.positionMap.clear();
    }

    updateAllPositions(): void {
        const updatedPositionMap = new Map<number, { cardId: number, position: NumberOfSelectedCardsPosition }>();

        for (const [key, { cardId, position }] of this.positionMap.entries()) {
            const newPositionY = this.getSelectedCardBlockPositionY(cardId);
            if (newPositionY) {
                position.setPosition(this.positionX, newPositionY);
                updatedPositionMap.set(key, { cardId, position }); // 기존 key 유지하면서 값 업데이트
                console.log(`카드: ${cardId}, 재정렬된 위치: ${position.getY()}`);
            }
        }
        this.positionMap = updatedPositionMap; // 업데이트된 맵을 적용
    }

    count(): number {
        return this.positionMap.size;
    }

    private getSelectedCardBlockPositionY(clickedCardId: number): number | null {
        const blockPosition = this.selectedCardBlockPositionRepository.findPositionByCardId(clickedCardId);
        if (!blockPosition) {
            console.warn(`[WARN] block Position (ID: ${clickedCardId}) not found`);
            return null;
        }
        const positionY = blockPosition.getY();
        return positionY;
    }
}
