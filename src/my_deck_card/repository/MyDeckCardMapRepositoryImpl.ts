import {MyDeckCardMapRepository} from "./MyDeckCardMapRepository";

    export class MyDeckCardMapRepositoryImpl implements MyDeckCardMapRepository {
        private static instance: MyDeckCardMapRepositoryImpl;

        // key: deckId, value: cardIdList
        private currentMyDeckCardMap: Map<number, number[]> = new Map();

        private constructor() {
            // 예시 데이터를 추가
            this.currentMyDeckCardMap.set(1, [2, 5, 8, 19, 20, 93, 26, 27, 2]);
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