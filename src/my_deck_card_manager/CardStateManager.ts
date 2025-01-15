export class CardStateManager {
    private static instance: CardStateManager | null = null;

    // deckId: [cardId: visible] 형태로 관리
    private deckCardVisibilityState: Map<number, Map<number, boolean>>;

    private constructor() {
        this.deckCardVisibilityState = new Map();
    }

    public static getInstance(): CardStateManager {
        if (!CardStateManager.instance) {
            CardStateManager.instance = new CardStateManager();
        }
        return CardStateManager.instance;
    }

    // 특정 deckId와 관련된 카드 상태 초기화: 맨 첫 페이지에서는 항상 8개의 카드만 visible
    public initializeCardState(deckId: number, cardIdList: number[]): void {
        if (!this.deckCardVisibilityState.has(deckId)) {
            const cardVisibility = new Map<number, boolean>();

            cardIdList.forEach((cardId, index) => {
                cardVisibility.set(cardId, index < 8);
            });

            this.deckCardVisibilityState.set(deckId, cardVisibility);
        }
    }

    // 특정 cardId의 visible 상태 설정
    public setCardVisibility(deckId: number, cardId: number, isVisible: boolean): void {
        const cardVisibility = this.deckCardVisibilityState.get(deckId);
        if (cardVisibility) {
            cardVisibility.set(cardId, isVisible);
        } else {
            console.warn(`[WARN] Deck ID ${deckId} is not initial`);
        }
    }

    // 특정 cardId의 visible 상태 조회
    public getCardVisibility(deckId: number, cardId: number): boolean {
        const cardVisibility = this.deckCardVisibilityState.get(deckId);
        return cardVisibility?.get(cardId) || false; // 기본값은 false
    }

    // 특정 deckId의 모든 카드 visible 상태 변경
    public setAllCardVisibility(deckId: number, isVisible: boolean): void {
        const cardVisibility = this.deckCardVisibilityState.get(deckId);
        if (cardVisibility) {
            cardVisibility.forEach((_, cardId) => cardVisibility.set(cardId, isVisible));
        } else {
            console.warn(`[WARN] Deck ID ${deckId} is not initial`);
        }
    }

    // 모든 visible 상태 초기화
    public resetVisibility(): void {
        this.deckCardVisibilityState.clear();
    }

    // 특정 deckId에서 visible 상태가 true인 cardId 리스트 반환
    public getVisibleCards(deckId: number): number[] {
        const cardVisibility = this.deckCardVisibilityState.get(deckId);
        if (!cardVisibility) {
            return [];
        }
        return Array.from(cardVisibility.entries())
            .filter(([_, isVisible]) => isVisible)
            .map(([cardId]) => cardId);
    }
}
