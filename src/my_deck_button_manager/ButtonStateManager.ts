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

    // 버튼의 visibility 상태를 설정
    public setVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonVisibilityState.set(buttonId, isVisible);
    }

    // 버튼의 visibility 상태를 가져옴
    public getVisibility(buttonId: number): boolean {
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
