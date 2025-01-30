import {CardStateManager} from "./CardStateManager";

export class CardPageManager {
    private static instance: CardPageManager | null = null;
    private currentPage: number;
    private cardsPerPage: number;
    private cardStateManager: CardStateManager;

    private constructor(cardsPerPage: number = 8) {
        this.currentPage = 1;
        this.cardsPerPage = cardsPerPage;
        this.cardStateManager = CardStateManager.getInstance();
    }

    static getInstance(): CardPageManager {
        if (!CardPageManager.instance) {
            CardPageManager.instance = new CardPageManager();
        }
        return CardPageManager.instance;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    public getTotalPages(cardIdList: number[]): number {
        return Math.ceil(cardIdList.length / this.cardsPerPage);
    }

    public resetCurrentPage(): void {
        this.currentPage = 1;
    }

    public findCardIdsForPage(page: number, cardIdList: number[]): number[] {
        const startIndex = (page - 1) * this.cardsPerPage;
        const endIndex = Math.min(startIndex + this.cardsPerPage, cardIdList.length);
        const cardIdsInRange = cardIdList.slice(startIndex, endIndex);

        console.log(`[DEBUG]Current Page: ${page}, CardId: ${cardIdsInRange}`);
        return cardIdsInRange;

    }

}
