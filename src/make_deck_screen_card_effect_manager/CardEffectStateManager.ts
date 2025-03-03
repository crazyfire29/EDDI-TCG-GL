import {MakeDeckScreenCardEffectRepositoryImpl} from "../make_deck_screen_card_effect/repository/MakeDeckScreenCardEffectRepositoryImpl";

export class CardEffectStateManager {
    private static instance: CardEffectStateManager | null = null;
    private effectVisibilityState: Map<number, boolean>;
    private makeDeckScreenCardEffectRepository: MakeDeckScreenCardEffectRepositoryImpl;

    private constructor() {
        this.effectVisibilityState = new Map();
        this.makeDeckScreenCardEffectRepository = MakeDeckScreenCardEffectRepositoryImpl.getInstance();
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
            this.makeDeckScreenCardEffectRepository.hideEffect(cardId);
        });
    }

    public setEffectVisibility(cardId: number, isVisible: boolean): void {
        this.effectVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.makeDeckScreenCardEffectRepository.showEffect(cardId);
        } else {
            this.makeDeckScreenCardEffectRepository.hideEffect(cardId);
        }
    }

    public findEffectVisibility(cardId: number): boolean {
        return this.effectVisibilityState.get(cardId) || false;
    }

    public resetEffectVisibility(): void {
        this.effectVisibilityState.clear();
    }
}
