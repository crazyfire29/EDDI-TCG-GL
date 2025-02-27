import {Vector2d} from "../../common/math/Vector2d";
import {SelectedCardBlockPosition} from "../entity/SelectedCardBlockPosition";
import {SelectedCardBlockPositionRepository} from "./SelectedCardBlockPositionRepository";

export class SelectedCardBlockPositionRepositoryImpl implements SelectedCardBlockPositionRepository {
    private static instance: SelectedCardBlockPositionRepositoryImpl;
    private positionMap: Map<number, { cardId: number, position: SelectedCardBlockPosition}> = new Map();;

    private initialX = 0.3885;
    private initialY = 0.36;
    private incrementY = - 0.0706;
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
        const positionY = this.initialY + (this.positionIndex - 1) * this.incrementY;

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

    public findPositionIdByCardId(cardId: number): number | null {
        for (const [positionId, { cardId: storedCardId }] of this.positionMap.entries()) {
            if (storedCardId === cardId) {
                return positionId;
            }
        }
        return null;
    }

    public findAllPosition(): SelectedCardBlockPosition[] {
        return Array.from(this.positionMap.values()).map(({ position }) => position);
    }

    // 버튼은 생성될 때마다 고유 아이디가 자동으로 부여되기 때문에 인덱스 번호 재정렬 필요x
    public deleteById(positionId: number): void {
        this.positionMap.delete(positionId);

        let newPositionIndex = 0;
        const updatedPositionMap = new Map<number, { cardId: number, position: SelectedCardBlockPosition }>();

        for (const [key, { cardId, position }] of this.positionMap.entries()) {
            const newPositionY = this.initialY + (newPositionIndex * this.incrementY);
            position.setPosition(this.initialX, newPositionY);
            updatedPositionMap.set(key, { cardId, position }); // 기존 key 유지하면서 값 업데이트
            newPositionIndex++;
        }

        this.positionMap = updatedPositionMap; // 업데이트된 맵을 적용
        this.positionIndex = Math.max(0, this.positionIndex - 1); // 인덱스 감소 처리
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
