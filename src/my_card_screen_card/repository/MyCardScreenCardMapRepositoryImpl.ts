import {MyCardScreenCardMapRepository} from "./MyCardScreenCardMapRepository";

export class MyCardScreenCardMapRepositoryImpl implements MyCardScreenCardMapRepository {
    private static instance: MyCardScreenCardMapRepositoryImpl;

    // key: cardId, value: cardCount
    private currentMyCardScreenCardMap: Map<number, number> = new Map();

    private constructor() {
        // 예시 데이터를 추가
//         this.currentMyCardScreenCardMap.set(2, 3);
//         this.currentMyCardScreenCardMap.set(8, 1);
//         this.currentMyCardScreenCardMap.set(9, 3);
//         this.currentMyCardScreenCardMap.set(17, 3);
//         this.currentMyCardScreenCardMap.set(19, 1);
//         this.currentMyCardScreenCardMap.set(20, 1);
//         this.currentMyCardScreenCardMap.set(25, 2);
//         this.currentMyCardScreenCardMap.set(26, 1);
        this.currentMyCardScreenCardMap.set(5, 10);
        this.currentMyCardScreenCardMap.set(6, 15);
//         this.currentMyCardScreenCardMap.set(7, 3);
//         this.currentMyCardScreenCardMap.set(10, 1);
        this.currentMyCardScreenCardMap.set(13, 9);
        this.currentMyCardScreenCardMap.set(14, 2);
        this.currentMyCardScreenCardMap.set(15, 2);
        this.currentMyCardScreenCardMap.set(16, 1);
        this.currentMyCardScreenCardMap.set(23, 1);
//         this.currentMyCardScreenCardMap.set(27, 2);
//         this.currentMyCardScreenCardMap.set(30, 2);
//         this.currentMyCardScreenCardMap.set(33, 3);
        this.currentMyCardScreenCardMap.set(48, 1);
        this.currentMyCardScreenCardMap.set(49, 3);
//         this.currentMyCardScreenCardMap.set(50, 1);
        this.currentMyCardScreenCardMap.set(51, 5);
        this.currentMyCardScreenCardMap.set(52, 1);
        this.currentMyCardScreenCardMap.set(53, 2);
        this.currentMyCardScreenCardMap.set(54, 1);
        this.currentMyCardScreenCardMap.set(55, 1);
        this.currentMyCardScreenCardMap.set(56, 1);
        this.currentMyCardScreenCardMap.set(57, 6);

    }

    public static getInstance(): MyCardScreenCardMapRepositoryImpl {
        if (!MyCardScreenCardMapRepositoryImpl.instance) {
            MyCardScreenCardMapRepositoryImpl.instance = new MyCardScreenCardMapRepositoryImpl();
        }
        return MyCardScreenCardMapRepositoryImpl.instance;
    }

    public getCurrentMyCardScreenCardMap(): Map<number, number> {
        return new Map(this.currentMyCardScreenCardMap);
    }

    public addMyCardScreenCard(cardId: number, cardCount: number): void {
        this.currentMyCardScreenCardMap.set(cardId, cardCount);
    }

    public getCardIdList(): number[] {
        return Array.from(this.currentMyCardScreenCardMap.keys());
    }

    public getCardCountList(): number[] {
        return Array.from(this.currentMyCardScreenCardMap.values());
    }

}