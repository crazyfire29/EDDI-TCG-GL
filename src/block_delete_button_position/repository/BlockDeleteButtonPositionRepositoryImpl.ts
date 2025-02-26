import {Vector2d} from "../../common/math/Vector2d";
import {BlockDeleteButtonPosition} from "../entity/BlockDeleteButtonPosition";
import {BlockDeleteButtonPositionRepository} from "./BlockDeleteButtonPositionRepository";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";

export class BlockDeleteButtonPositionRepositoryImpl implements BlockDeleteButtonPositionRepository {
    private static instance: BlockDeleteButtonPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: BlockDeleteButtonPosition }> = new Map(); // position unique id: {card id: mesh}
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;

    private positionX = 0.4682;

    private constructor() {
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
    }

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

    public deletePositionByCardId(clickedCardId: number): void {
        let positionIdToDelete: number | null = null;

        // 삭제할 버튼 ID 찾기
        for (const [positionId, { cardId }] of this.positionMap.entries()) {
            if (cardId === clickedCardId) {
                positionIdToDelete = positionId;
                break;
            }
        }

        if (positionIdToDelete !== null) {
            this.positionMap.delete(positionIdToDelete);

            // positionMap 재정렬
            const newPositionMap = new Map<number, { cardId: number, position: BlockDeleteButtonPosition }>();
            let newPositionId = 0;

            for (const { cardId, position } of this.positionMap.values()) {
                const newPosition = this.selectedCardBlockPositionRepository.findPositionByCardId(cardId);
                if (newPosition) {
                    const newPositionY = newPosition.getY();
                    if (newPositionY) {
                        position.setPosition(this.positionX, newPositionY);
                        newPositionMap.set(newPositionId++, { cardId, position });
                    }
                }
//                 newPositionMap.set(newPositionId++, { cardId, position });
            }

            this.positionMap = newPositionMap;
        }
    }

    count(): number {
        return this.positionMap.size;
    }
}
