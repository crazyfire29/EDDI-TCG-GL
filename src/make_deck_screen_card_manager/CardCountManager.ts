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

     public findTotalSelectedCardCount(): number {
         const totalCount = Array.from(this.gradeIdToClickCardCountMap.values()).reduce((sum, count) => sum + count, 0);
         console.log(`Current Total Selected Card Count?: ${totalCount}`);
         return totalCount;
     }

     public getMaxClickCountByGrade(grade: number): number {
         switch (grade) {
             case 1: return 15;  // 일반 (15장)
             case 2: return 12;  // 언커먼 (12장)
             case 3: return 9;   // 영웅 (9장)
             case 4: return 3;   // 전설 (3장)
             case 5: return 1;   // 신화 (1장)
             default:
                 console.warn(`[WARN] Unknown grade "${grade}"`);
                 return 0;
         }
     }
}
