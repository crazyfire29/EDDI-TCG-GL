import {MakeDeckScreenCardRepositoryImpl} from "../make_deck_screen_card/repository/MakeDeckScreenCardRepositoryImpl";

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

     // 사용자가 소지한 카드 갯수에 따라 카드 클릭 횟수 제한
     public saveCardClickCount(cardId: number): void {
         const userOwnedCardCount = this.makeDeckScreenCardRepository.findCardCountByCardId(cardId);
         let cardClickCount = this.findCardClickCount(cardId) ?? 0;

         if (userOwnedCardCount !== null && cardClickCount < userOwnedCardCount) {
             cardClickCount++;
             console.log(`[DEBUG] Click Count for Card ID ${cardId}: ${cardClickCount}`);
             this.clickCardCountMap.set(cardId, cardClickCount);

         } else {
             console.warn(`[DEBUG] Click Count for Card ID ${cardId} is already at max (${userOwnedCardCount})`);
         }
     }

}
