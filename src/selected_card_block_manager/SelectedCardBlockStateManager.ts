import {SelectedCardBlockRepositoryImpl} from "../selected_card_block/repository/SelectedCardBlockRepositoryImpl";

export class SelectedCardBlockStateManager {
    private static instance: SelectedCardBlockStateManager | null = null;
    private blockVisibilityState: Map<number, boolean>;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl

    private constructor() {
        this.blockVisibilityState = new Map();
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
    }

    public static getInstance(): SelectedCardBlockStateManager {
        if (!SelectedCardBlockStateManager.instance) {
            SelectedCardBlockStateManager.instance = new SelectedCardBlockStateManager();
        }
        return SelectedCardBlockStateManager.instance;
    }

    // 특정 block 의 visible 상태 설정
    public setBlockVisibility(cardId: number, isVisible: boolean): void {
        this.blockVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.selectedCardBlockRepository.showBlock(cardId);
        } else {
            this.selectedCardBlockRepository.hideBlock(cardId);
        }
    }

    // 특정 block 의 visible 상태 조회
    public findBlockVisibility(cardId: number): boolean {
        return this.blockVisibilityState.get(cardId) || false;
    }

    public findAllBlockVisibility(): boolean[] {
        return Array.from(this.blockVisibilityState.values());
    }

    public findHiddenBlockIds(): number[] {
        return Array.from(this.blockVisibilityState.entries())
                .filter(([_, isVisible]) => isVisible === false)
                .map(([cardId, _]) => cardId);
    }

    // 모든 visible 상태 초기화
    public resetBlockVisibility(): void {
        this.blockVisibilityState.clear();
    }
}
