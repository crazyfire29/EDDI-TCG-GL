import {NumberOfOwnedCardsRepositoryImpl} from "../number_of_owned_cards/repository/NumberOfOwnedCardsRepositoryImpl";

export class NumberOfOwnedCardsStateManager {
    private static instance: NumberOfOwnedCardsStateManager | null = null;
    private numberVisibilityState: Map<number, boolean>;
    private numberOfOwnedCardsRepository: NumberOfOwnedCardsRepositoryImpl;

    private constructor() {
        this.numberVisibilityState = new Map();
        this.numberOfOwnedCardsRepository = NumberOfOwnedCardsRepositoryImpl.getInstance();
    }

    public static getInstance(): NumberOfOwnedCardsStateManager {
        if (!NumberOfOwnedCardsStateManager.instance) {
            NumberOfOwnedCardsStateManager.instance = new NumberOfOwnedCardsStateManager();
        }
        return NumberOfOwnedCardsStateManager.instance;
    }

    public initializeNumberVisibility(cardIdList: number[]): void {
        cardIdList.forEach((cardId) => {
            this.numberVisibilityState.set(cardId, false);
            this.numberOfOwnedCardsRepository.hideNumber(cardId);
        });
    }

    public setNumberVisibility(cardId: number, isVisible: boolean): void {
        this.numberVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.numberOfOwnedCardsRepository.showNumber(cardId);
        } else {
            this.numberOfOwnedCardsRepository.hideNumber(cardId);
        }
    }

    public findNumberVisibility(cardId: number): boolean {
        return this.numberVisibilityState.get(cardId) || false;
    }

    public resetNumberVisibility(): void {
        this.numberVisibilityState.clear();
    }
}
