import {MyDeckNameText} from "../my_deck_name_text/entity/MyDeckNameText";

export class NameTextStateManager {
    private static instance: NameTextStateManager | null = null;
    private textVisibilityState: Map<number, boolean>;

    constructor() {
        this.textVisibilityState = new Map();
    }

    public static getInstance(): NameTextStateManager {
        if (!NameTextStateManager.instance) {
            NameTextStateManager.instance = new NameTextStateManager();
        }
        return NameTextStateManager.instance;
    }

    // 첫 화면에서는 최대 6개의 텍스트가 배치됨
    public initializeNameTextState(nameTextIdList: number[]): void {
        nameTextIdList.forEach((textId, index) => {
            this.textVisibilityState.set(textId, index < 6);
        });
    }

    public setVisibility(textId: number, isVisible: boolean): void {
        this.textVisibilityState.set(textId, isVisible);
    }

    public findVisibility(textId: number): boolean {
        return this.textVisibilityState.get(textId) || false;
    }

    public resetVisibility(): void {
        this.textVisibilityState.clear();
    }

}
