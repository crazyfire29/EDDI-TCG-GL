import {MyCardScreenDetailCardRepositoryImpl} from "../my_card_screen_detail_card/repository/MyCardScreenDetailCardRepositoryImpl";

export class DetailCardStateManager {
    private static instance: DetailCardStateManager | null = null;
    private cardVisibilityState: Map<number, boolean>;
    private myCardScreenDetailCardRepository: MyCardScreenDetailCardRepositoryImpl;

    private constructor() {
        this.cardVisibilityState = new Map();
        this.myCardScreenDetailCardRepository = MyCardScreenDetailCardRepositoryImpl.getInstance();
    }

    public static getInstance(): DetailCardStateManager {
        if (!DetailCardStateManager.instance) {
            DetailCardStateManager.instance = new DetailCardStateManager();
        }
        return DetailCardStateManager.instance;
    }

    public initializeCardVisibility(cardIdList: number[]): void {
        cardIdList.forEach((cardId) => {
            this.cardVisibilityState.set(cardId, false);
            this.myCardScreenDetailCardRepository.hideCard(cardId);
        });
    }

    public setCardVisibility(cardId: number, isVisible: boolean): void {
        this.cardVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.myCardScreenDetailCardRepository.showCard(cardId);
        } else {
            this.myCardScreenDetailCardRepository.hideCard(cardId);
        }
    }

    public findCardVisibility(cardId: number): boolean {
        return this.cardVisibilityState.get(cardId) || false;
    }

    public resetCardVisibility(): void {
        this.cardVisibilityState.clear();
    }
}
