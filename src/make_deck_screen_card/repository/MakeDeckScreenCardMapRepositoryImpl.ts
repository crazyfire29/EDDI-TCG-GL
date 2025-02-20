import {MakeDeckScreenCardMapRepository} from "./MakeDeckScreenCardMapRepository";

export class MakeDeckScreenCardMapRepositoryImpl implements MakeDeckScreenCardMapRepository {
    private static instance: MakeDeckScreenCardMapRepositoryImpl;

    // key: cardId, value: cardCount
    private currentMakeDeckScreenCardMap: Map<number, number> = new Map();

    private constructor() {
        // 예시 데이터를 추가
        this.currentMakeDeckScreenCardMap.set(2, 3);
        this.currentMakeDeckScreenCardMap.set(8, 1);
        this.currentMakeDeckScreenCardMap.set(9, 3);
        this.currentMakeDeckScreenCardMap.set(17, 3);
        this.currentMakeDeckScreenCardMap.set(19, 1);
        this.currentMakeDeckScreenCardMap.set(20, 1);
        this.currentMakeDeckScreenCardMap.set(25, 2);
        this.currentMakeDeckScreenCardMap.set(26, 1);
        this.currentMakeDeckScreenCardMap.set(5, 4);
        this.currentMakeDeckScreenCardMap.set(6, 5);
        this.currentMakeDeckScreenCardMap.set(7, 3);
        this.currentMakeDeckScreenCardMap.set(10, 1);
        this.currentMakeDeckScreenCardMap.set(13, 1);
        this.currentMakeDeckScreenCardMap.set(14, 2);
        this.currentMakeDeckScreenCardMap.set(15, 2);
        this.currentMakeDeckScreenCardMap.set(16, 1);
        this.currentMakeDeckScreenCardMap.set(23, 1);
        this.currentMakeDeckScreenCardMap.set(27, 2);
        this.currentMakeDeckScreenCardMap.set(30, 2);
        this.currentMakeDeckScreenCardMap.set(33, 3);
        this.currentMakeDeckScreenCardMap.set(48, 1);
        this.currentMakeDeckScreenCardMap.set(49, 3);
        this.currentMakeDeckScreenCardMap.set(50, 1);
        this.currentMakeDeckScreenCardMap.set(51, 5);
        this.currentMakeDeckScreenCardMap.set(52, 1);
        this.currentMakeDeckScreenCardMap.set(53, 2);
        this.currentMakeDeckScreenCardMap.set(54, 1);
        this.currentMakeDeckScreenCardMap.set(55, 1);
        this.currentMakeDeckScreenCardMap.set(56, 1);
        this.currentMakeDeckScreenCardMap.set(57, 6);

    }

    public static getInstance(): MakeDeckScreenCardMapRepositoryImpl {
        if (!MakeDeckScreenCardMapRepositoryImpl.instance) {
            MakeDeckScreenCardMapRepositoryImpl.instance = new MakeDeckScreenCardMapRepositoryImpl();
        }
        return MakeDeckScreenCardMapRepositoryImpl.instance;
    }

    public getCurrentMakeDeckScreenCardMap(): Map<number, number> {
        return new Map(this.currentMakeDeckScreenCardMap);
    }

    // 새로운 카드를 추가하는 메서드
    public addMakeDeckScreenCard(cardId: number, cardCount: number): void {
        this.currentMakeDeckScreenCardMap.set(cardId, cardCount);
    }

    public getCardIdList(): number[] {
        return Array.from(this.currentMakeDeckScreenCardMap.keys());
    }

    public getCardCountList(): number[] {
        return Array.from(this.currentMakeDeckScreenCardMap.values());
    }

}