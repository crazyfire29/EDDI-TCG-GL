import { MyDeckButton } from "../my_deck_button/entity/MyDeckButton";

export class ButtonStateManager {
    private static instance: ButtonStateManager | null = null;
    private buttonVisibilityState: Map<number, boolean>;  // 버튼의 visibility 상태를 저장하는 Map
    private buttonClickCount: number;

    constructor() {
        this.buttonVisibilityState = new Map();
        this.buttonClickCount = 0;
    }

    public static getInstance(): ButtonStateManager {
        if (!ButtonStateManager.instance) {
            ButtonStateManager.instance = new ButtonStateManager();
        }
        return ButtonStateManager.instance;
    }

    // 첫 화면에서는 최대 6개의 덱이 배치됨
    public initializeButtonState(buttonIdList: number[]): void {
        buttonIdList.forEach((buttonId, index) => {
            this.buttonVisibilityState.set(buttonId, index < 6);
        });
    }

    // 특정 버튼의 visibility 상태를 설정
    public setVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonVisibilityState.set(buttonId, isVisible);
    }

    // 버튼의 visibility 상태를 가져옴
    public findVisibility(buttonId: number): boolean {
        return this.buttonVisibilityState.get(buttonId) || false;
    }

    // 모든 버튼의 상태를 초기화
    public resetVisibility(): void {
        this.buttonVisibilityState.clear();  // 모든 상태를 초기화
    }

    public getButtonClickCount(): number {
        return this.buttonClickCount;
    }

    public setButtonClickCount(clickCount: number): void {
        this.buttonClickCount = clickCount;
    }

    public resetButtonClickCount(): void {
        this.buttonClickCount = 0;
    }
}
