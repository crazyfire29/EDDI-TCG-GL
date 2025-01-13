import {MyDeckCardMapRepository} from "./MyDeckCardMapRepository";

    export class MyDeckCardMapRepositoryImpl implements MyDeckCardMapRepository {
        private static instance: MyDeckCardMapRepositoryImpl;

        // key: deckId, value: cardIdList
        private currentMyDeckCardMap: Map<number, number[]> = new Map();

        private constructor() {
            // 예시 데이터를 추가
            this.currentMyDeckCardMap.set(1,
                [2, 5, 8, 19, 20, 93, 26, 27, 2, 14, 15, 31, 33, 35, 36, 29,
                 30, 32, 40, 43, 47, 49, 55, 56]);
            this.currentMyDeckCardMap.set(2,
                [5, 8, 8, 19, 20, 33, 35, 29, 30, 40, 56, 55, 2, 93]);
            this.currentMyDeckCardMap.set(3, [19, 33, 35, 40, 55, 29, 70, 71]);
            this.currentMyDeckCardMap.set(4, [70, 71, 72, 74, 76, 77, 99, 119]);
            this.currentMyDeckCardMap.set(5, [129, 130, 133, 134, 139, 141, 143, 145]);
            this.currentMyDeckCardMap.set(6, [30, 32, 40, 43, 47, 49, 55, 56]);
            this.currentMyDeckCardMap.set(7, [35, 29, 30, 40, 56, 55, 2, 93]);
            this.currentMyDeckCardMap.set(8, [19, 20, 93, 26, 27, 2, 14, 15]);
        }

        public static getInstance(): MyDeckCardMapRepositoryImpl {
            if (!MyDeckCardMapRepositoryImpl.instance) {
                MyDeckCardMapRepositoryImpl.instance = new MyDeckCardMapRepositoryImpl();
            }
            return MyDeckCardMapRepositoryImpl.instance;
        }

        // 새로운 덱을 추가하는 메서드
        public addMyDeckCard(deckId: number, cardIdList: number[]): void {
            this.currentMyDeckCardMap.set(deckId, cardIdList);
        }

        public getDeckIdAndCardLists(): [number, number[]][] {
            return Array.from(this.currentMyDeckCardMap.entries());
        }

    }