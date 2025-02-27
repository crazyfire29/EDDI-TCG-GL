import {SelectedCardBlockEffectRepositoryImpl} from "../selected_card_block_effect/repository/SelectedCardBlockEffectRepositoryImpl";

export class SelectedCardBlockEffectStateManager {
    private static instance: SelectedCardBlockEffectStateManager | null = null;
    private effectVisibilityState: Map<number, boolean>;
    private selectedCardBlockEffectRepository: SelectedCardBlockEffectRepositoryImpl;

    private constructor() {
        this.effectVisibilityState = new Map();
        this.selectedCardBlockEffectRepository = SelectedCardBlockEffectRepositoryImpl.getInstance();
    }

    public static getInstance(): SelectedCardBlockEffectStateManager {
        if (!SelectedCardBlockEffectStateManager.instance) {
            SelectedCardBlockEffectStateManager.instance = new SelectedCardBlockEffectStateManager();
        }
        return SelectedCardBlockEffectStateManager.instance;
    }

    // 처음 화면에서는 effect visible false 로 설정
    public initializeEffectVisibility(cardId: number): void {
        this.effectVisibilityState.set(cardId, false);
        this.selectedCardBlockEffectRepository.hideEffect(cardId);
    }

    public setEffectVisibility(cardId: number, isVisible: boolean): void {
        this.effectVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.selectedCardBlockEffectRepository.showEffect(cardId);
        } else {
            this.selectedCardBlockEffectRepository.hideEffect(cardId);
        }
    }

    public findEffectVisibility(cardId: number): boolean {
        return this.effectVisibilityState.get(cardId) || false;
    }

    public resetEffectVisibility(): void {
        this.effectVisibilityState.clear();
    }

    public deleteEffectVisibilityByCardId(cardId: number): void {
        this.effectVisibilityState.delete(cardId);
    }
}
