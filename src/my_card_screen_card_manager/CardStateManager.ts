import {MyCardScreenCardRepositoryImpl} from "../my_card_screen_card/repository/MyCardScreenCardRepositoryImpl";

export class CardStateManager {
    private static instance: CardStateManager | null = null;
    private cardVisibilityState: Map<number, boolean>;
    private myCardScreenCareRepository: MyCardScreenCardRepositoryImpl;

    private constructor() {
        this.cardVisibilityState = new Map();
        this.myCardScreenCareRepository = MyCardScreenCardRepositoryImpl.getInstance();
    }

    public static getInstance(): CardStateManager {
        if (!CardStateManager.instance) {
            CardStateManager.instance = new CardStateManager();
        }
        return CardStateManager.instance;
    }

    // 모든 카드 처음에는 visible false 로 설정
    public initializeCardVisibility(cardIdList: number[]): void {
        cardIdList.forEach((cardId) => {
            this.cardVisibilityState.set(cardId, false);
            this.myCardScreenCareRepository.hideCard(cardId);
        });
    }

    // 특정 cardId의 visible 상태 설정
    public setCardVisibility(cardId: number, isVisible: boolean): void {
        this.cardVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.myCardScreenCareRepository.showCard(cardId);
        } else {
            this.myCardScreenCareRepository.hideCard(cardId);
        }
    }

    // 특정 cardId의 visible 상태 조회
    public findCardVisibility(cardId: number): boolean {
        return this.cardVisibilityState.get(cardId) || false;
    }

    // 모든 visible 상태 초기화
    public resetCardVisibility(): void {
        this.cardVisibilityState.clear();
    }
}
