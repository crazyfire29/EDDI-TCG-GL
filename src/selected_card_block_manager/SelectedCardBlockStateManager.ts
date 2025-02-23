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
    public setBlockVisibility(blockUniqueId: number, isVisible: boolean): void {
        this.blockVisibilityState.set(blockUniqueId, isVisible);
        if (isVisible == true) {
            this.selectedCardBlockRepository.showBlock(blockUniqueId);
        } else {
            this.selectedCardBlockRepository.hideBlock(blockUniqueId);
        }
    }

    // 특정 block 의 visible 상태 조회
    public findBlockVisibility(blockUniqueId: number): boolean {
        return this.blockVisibilityState.get(blockUniqueId) || false;
    }

    public findAllBlockVisibility(): boolean[] {
        return Array.from(this.blockVisibilityState.values());
    }

    public findHiddenBlockIds(): number[] {
        return Array.from(this.blockVisibilityState.entries())
                .filter(([_, isVisible]) => isVisible === false)
                .map(([blockUniqueId, _]) => blockUniqueId);
    }

    // 모든 visible 상태 초기화
    public resetBlockVisibility(): void {
        this.blockVisibilityState.clear();
    }
}
