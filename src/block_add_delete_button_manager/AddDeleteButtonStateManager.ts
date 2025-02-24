import {BlockAddButtonRepositoryImpl} from "../block_add_button/repository/BlockAddButtonRepositoryImpl";
import {BlockDeleteButtonRepositoryImpl} from "../block_delete_button/repository/BlockDeleteButtonRepositoryImpl";

export class AddDeleteButtonStateManager {
    private static instance: AddDeleteButtonStateManager | null = null;
    private addButtonVisibilityState: Map<number, boolean> = new Map();
    private deleteButtonVisibilityState: Map<number, boolean> = new Map();
    private blockAddButtonRepository: BlockAddButtonRepositoryImpl;
    private blockDeleteButtonRepository: BlockDeleteButtonRepositoryImpl;

    private constructor() {
        this.blockAddButtonRepository = BlockAddButtonRepositoryImpl.getInstance();
        this.blockDeleteButtonRepository = BlockDeleteButtonRepositoryImpl.getInstance();
    }

    public static getInstance(): AddDeleteButtonStateManager {
        if (!AddDeleteButtonStateManager.instance) {
            AddDeleteButtonStateManager.instance = new AddDeleteButtonStateManager();
        }
        return AddDeleteButtonStateManager.instance;
    }

    // 처음에는 모든 버튼의 visible false 로 설정
    public initializeAddButtonVisibility(cardId: number): void {
        this.addButtonVisibilityState.set(cardId, false);
        this.blockAddButtonRepository.hideButton(cardId);
    }

    public initializeDeleteButtonVisibility(cardId: number): void {
        this.deleteButtonVisibilityState.set(cardId, false);
        this.blockDeleteButtonRepository.hideButton(cardId);
    }

    // 특정 버튼의 visible 상태 설정
    public setAddButtonVisibility(cardId: number, isVisible: boolean): void {
        this.addButtonVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.blockAddButtonRepository.showButton(cardId);
        } else {
            this.blockAddButtonRepository.hideButton(cardId);
        }
    }

    public setDeleteButtonVisibility(cardId: number, isVisible: boolean): void {
        this.deleteButtonVisibilityState.set(cardId, isVisible);
        if (isVisible == true) {
            this.blockDeleteButtonRepository.showButton(cardId);
        } else {
            this.blockDeleteButtonRepository.hideButton(cardId);
        }
    }

    public findAddButtonVisibility(cardId: number): boolean {
        return this.addButtonVisibilityState.get(cardId) || false;
    }

    public findDeleteButtonVisibility(cardId: number): boolean {
        return this.deleteButtonVisibilityState.get(cardId) || false;
    }

    public resetAddButtonVisibility(): void {
        this.addButtonVisibilityState.clear();
    }

    public resetDeleteButtonVisibility(): void {
        this.deleteButtonVisibilityState.clear();
    }
}
