import {MyDeckButtonEffect} from "../my_deck_button_effect/entity/MyDeckButtonEffect";
import {MyDeckButtonEffectRepositoryImpl} from "../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

export class ButtonEffectManager {
    private buttonEffectState: Map<number, boolean>;

    constructor() {
        this.buttonEffectState = new Map();
    }

    setVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonEffectState.set(buttonId, isVisible);
        console.log(`[DEBUG] Set button ${buttonId} visibility to ${isVisible}`);

        const buttonEffect = MyDeckButtonEffectRepositoryImpl.getInstance().findById(buttonId);
            if (buttonEffect) {
                const mesh = buttonEffect.getMesh();
                if (mesh) {
                    mesh.visible = isVisible;
                }
            }
    }

    getVisibility(buttonId: number): boolean {
        return this.buttonEffectState.get(buttonId) ?? false;
    }

    resetVisibility(): void {
        this.buttonEffectState.clear();

        const allEffectButtons = MyDeckButtonEffectRepositoryImpl.getInstance().findAll();
        allEffectButtons.forEach((button) => {
            const mesh = button.getMesh();
            if (mesh) {
                mesh.visible = false;
            }
        });

        console.log(`[DEBUG] Reset all button visibility.`);
    }

}
