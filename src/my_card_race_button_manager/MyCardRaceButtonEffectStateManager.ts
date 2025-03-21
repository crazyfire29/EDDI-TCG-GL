import {MyCardRaceButtonEffect} from "../my_card_race_button_effect/entity/MyCardRaceButtonEffect";
import {MyCardRaceButtonEffectRepositoryImpl} from "../my_card_race_button_effect/repository/MyCardRaceButtonEffectRepositoryImpl";

export class MyCardRaceButtonEffectStateManager {
    private static instance: MyCardRaceButtonEffectStateManager | null = null;
    private effectVisibilityState: Map<number, boolean>;
    private myCardRaceButtonEffectRepository: MyCardRaceButtonEffectRepositoryImpl;

    constructor() {
        this.effectVisibilityState = new Map();
        this.myCardRaceButtonEffectRepository = MyCardRaceButtonEffectRepositoryImpl.getInstance();
    }

    public static getInstance(): MyCardRaceButtonEffectStateManager {
        if (!MyCardRaceButtonEffectStateManager.instance) {
            MyCardRaceButtonEffectStateManager.instance = new MyCardRaceButtonEffectStateManager();
        }
        return MyCardRaceButtonEffectStateManager.instance;
    }

    public setVisibility(effectId: number, isVisible: boolean): void {
        this.effectVisibilityState.set(effectId, isVisible);
        if (isVisible == true) {
            this.myCardRaceButtonEffectRepository.showEffect(effectId);
        } else {
            this.myCardRaceButtonEffectRepository.hideEffect(effectId);
        }
    }

    public findVisibility(effectId: number): boolean {
        return this.effectVisibilityState.get(effectId) || false;
    }

    public resetVisibility(): void {
        this.effectVisibilityState.clear();
    }

}
