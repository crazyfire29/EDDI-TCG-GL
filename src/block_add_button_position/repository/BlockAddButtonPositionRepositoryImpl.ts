import {Vector2d} from "../../common/math/Vector2d";
import {BlockAddButtonPosition} from "../entity/BlockAddButtonPosition";
import {BlockAddButtonPositionRepository} from "./BlockAddButtonPositionRepository";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";

export class BlockAddButtonPositionRepositoryImpl implements BlockAddButtonPositionRepository {
    private static instance: BlockAddButtonPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: BlockAddButtonPosition }> = new Map(); // position unique id: {card id: mesh}
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;

    private positionX = 0.4262;

    private constructor() {
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): BlockAddButtonPositionRepositoryImpl {
        if (!BlockAddButtonPositionRepositoryImpl.instance) {
            BlockAddButtonPositionRepositoryImpl.instance = new BlockAddButtonPositionRepositoryImpl();
        }
        return BlockAddButtonPositionRepositoryImpl.instance;
    }

    public addBlockAddButtonPosition(cardId: number, buttonPositionY: number): BlockAddButtonPosition {
        const positionX = this.positionX;
        const positionY = buttonPositionY;
        const newPosition = new BlockAddButtonPosition(positionX, positionY);
        this.positionMap.set(newPosition.id, { cardId, position: newPosition });

        return newPosition;
    }

    public findPositionByPositionId(positionId: number): BlockAddButtonPosition | null {
        const position = this.positionMap.get(positionId);
        if (position) {
            return position.position;
        } else {
            return null;
        }
    }

    public findPositionByCardId(cardId: number): BlockAddButtonPosition | null {
        for (const { cardId: storedCardId, position } of this.positionMap.values()) {
            if (storedCardId === cardId) {
                return position;
            }
        }
        return null;
    }

    public findAll(): BlockAddButtonPosition[] {
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

        let newPositionIndex = 0;
        const newPositionMap = new Map<number, { cardId: number, position: BlockAddButtonPosition }>();

        for (const [key, { cardId, position }] of this.positionMap.entries()) {
            const newPosition = this.selectedCardBlockPositionRepository.findPositionByCardId(cardId);
            if (newPosition) {
                const newPositionY = newPosition.getY();
                if (newPositionY) {
                    position.setPosition(this.positionX, newPositionY);
                    newPositionMap.set(key, { cardId, position });
                    newPositionIndex++;
                }
            }
        }
        this.positionMap = newPositionMap;
    }

    // 버튼은 생성될 때마다 고유 아이디가 자동으로 부여되기 때문에 인덱스 번호는 재정렬 필요x
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

            let newPositionIndex = 0;
            const newPositionMap = new Map<number, { cardId: number, position: BlockAddButtonPosition }>();

            for (const [key, { cardId, position }] of this.positionMap.entries()) {
                const newPosition = this.selectedCardBlockPositionRepository.findPositionByCardId(cardId);
                if (newPosition) {
                    const newPositionY = newPosition.getY();
                    if (newPositionY) {
                        position.setPosition(this.positionX, newPositionY);
                        newPositionMap.set(key, { cardId, position });
                        newPositionIndex++;
                    }
                }
            }
            this.positionMap = newPositionMap;
        }
    }

    count(): number {
        return this.positionMap.size;
    }
}
