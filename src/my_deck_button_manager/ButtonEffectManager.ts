import {MyDeckButtonEffect} from "../my_deck_button_effect/entity/MyDeckButtonEffect";
import {MyDeckButtonEffectRepositoryImpl} from "../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

export class ButtonEffectManager {
    private static instance: ButtonEffectManager | null = null;
    private buttonEffectState: Map<number, boolean>;

    constructor() {
        this.buttonEffectState = new Map();
    }

    public static getInstance(): ButtonEffectManager {
        if (!ButtonEffectManager.instance) {
            ButtonEffectManager.instance = new ButtonEffectManager();
        }
        return ButtonEffectManager.instance;
    }

    // 처음에는 effect가 나타나면 안 됨.
    public initializeEffectState(effectIdList: number[]): void {
        effectIdList.forEach((effectId) => {
            this.buttonEffectState.set(effectId, false); // 기본값을 false로 설정
        });
    }

    public setVisibility(effectId: number, isVisible: boolean): void {
        this.buttonEffectState.set(effectId, isVisible);
        console.log(`[DEBUG] Set Effect ${effectId} visibility to ${isVisible}`);
    }

    public findVisibility(effectId: number): boolean {
        return this.buttonEffectState.get(effectId) ?? false;
    }

    public resetVisibility(): void {
        this.buttonEffectState.clear();
        console.log(`[DEBUG] Reset all button visibility.`);
    }

}
