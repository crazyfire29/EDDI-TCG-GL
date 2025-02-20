import {MakeDeckScreenCardRepositoryImpl} from "../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";
import {getCardById} from "../card/utility";

export class CardCountManager {
    private static instance: CardCountManager | null = null;
    private currentClickCardId: number | null = null;
    private clickCardCountMap: Map<number, number> = new Map(); // cardId: cardClickCount
    private gradeIdToClickCardCountMap: Map<number, number> = new Map(); // gradId: cardClickCount
    private makeDeckScreenCardRepository: MakeDeckScreenCardRepositoryImpl;

    private constructor() {
        this.makeDeckScreenCardRepository = MakeDeckScreenCardRepositoryImpl.getInstance();
    }

    public static getInstance(): CardCountManager {
        if (!CardCountManager.instance) {
            CardCountManager.instance = new CardCountManager();
        }
        return CardCountManager.instance;
    }

     public saveCurrentClickedCardId(id: number): void {
         this.currentClickCardId = id;
     }

     public findCurrentClickedCardId(): number | null {
         return this.currentClickCardId;
     }

     public findCardClickCount(cardId: number): number | undefined {
         return this.clickCardCountMap.get(cardId);
     }

     public getCardClickCount(cardId: number): number {
         return this.clickCardCountMap.get(cardId) ?? 0;
     }

     public incrementCardClickCount(cardId: number): void {
         const currentCount = this.getCardClickCount(cardId);
         this.clickCardCountMap.set(cardId, currentCount + 1);
     }

     public getGradeClickCount(gradeId: number): number {
         return this.gradeIdToClickCardCountMap.get(gradeId) ?? 0;
     }

     public incrementGradeClickCount(gradeId: number): void {
         const currentCount = this.getGradeClickCount(gradeId);
         this.gradeIdToClickCardCountMap.set(gradeId, currentCount + 1);
     }

}
