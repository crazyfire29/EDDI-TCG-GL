import {MyCardScreenCardEffectRepositoryImpl} from "../my_card_screen_card_effect/repository/MyCardScreenCardEffectRepositoryImpl";

export class CardEffectStateManager {
    private static instance: CardEffectStateManager | null = null;
    private effectVisibilityState: Map<number, boolean>;
    private myCardScreenCardEffectRepository: MyCardScreenCardEffectRepositoryImpl;

    private constructor() {
        this.effectVisibilityState = new Map();
        this.myCardScreenCardEffectRepository = MyCardScreenCardEffectRepositoryImpl.getInstance();
    }

    public static getInstance(): CardEffectStateManager {
        if (!CardEffectStateManager.instance) {
            CardEffectStateManager.instance = new CardEffectStateManager();
        }
        return CardEffectStateManager.instance;
    }

    public initializeEffectVisibility(cardIdList: number[]): void {
        cardIdList.forEach((cardId) => {
            this.effectVisibilityState.set(cardId, false);
            this.myCardScreenCardEffectRepository.hideEffect(cardId);
        });
    }

    public setEffectVisibility(cardId: number, isVisible: boolean): void {
        this.effectVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.myCardScreenCardEffectRepository.showEffect(cardId);
        } else {
            this.myCardScreenCardEffectRepository.hideEffect(cardId);
        }
    }

    public findEffectVisibility(cardId: number): boolean {
        return this.effectVisibilityState.get(cardId) || false;
    }

    public resetEffectVisibility(): void {
        this.effectVisibilityState.clear();
    }

    public findShownEffectIds(): number[] {
        return Array.from(this.effectVisibilityState.entries())
                   .filter(([_, isVisible]) => isVisible === true)
                   .map(([cardId, _]) => cardId);
    }
}
