import { MyDeckButton } from "../my_deck_button/entity/MyDeckButton";

export class ButtonStateManager {
    private buttonVisibilityState: Map<number, boolean>;  // 버튼의 visibility 상태를 저장하는 Map

    constructor() {
        this.buttonVisibilityState = new Map();
    }

    // 버튼의 visibility 상태를 설정
    setVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonVisibilityState.set(buttonId, isVisible);
    }

    // 버튼의 visibility 상태를 가져옴
    getVisibility(buttonId: number): boolean {
        return this.buttonVisibilityState.get(buttonId) || false;
    }

    // 모든 버튼의 상태를 초기화
    resetVisibility(): void {
        this.buttonVisibilityState.clear();  // 모든 상태를 초기화
    }
}
