import {RaceButtonEffect} from "../race_button_effect/entity/RaceButtonEffect";
import {RaceButtonEffectRepositoryImpl} from "../race_button_effect/repository/RaceButtonEffectRepositoryImpl";

export class RaceButtonEffectStateManager {
    private static instance: RaceButtonEffectStateManager | null = null;
    private effectVisibilityState: Map<number, boolean>;
    private raceButtonEffectRepository: RaceButtonEffectRepositoryImpl;

    constructor() {
        this.effectVisibilityState = new Map();
        this.raceButtonEffectRepository = RaceButtonEffectRepositoryImpl.getInstance();
    }

    public static getInstance(): RaceButtonEffectStateManager {
        if (!RaceButtonEffectStateManager.instance) {
            RaceButtonEffectStateManager.instance = new RaceButtonEffectStateManager();
        }
        return RaceButtonEffectStateManager.instance;
    }

    public setVisibility(effectId: number, isVisible: boolean): void {
        this.effectVisibilityState.set(effectId, isVisible);
        if (isVisible == true) {
            this.raceButtonEffectRepository.showRaceButtonEffect(effectId);
        } else {
            this.raceButtonEffectRepository.hideRaceButtonEffect(effectId);
        }
    }

    public findVisibility(effectId: number): boolean {
        return this.effectVisibilityState.get(effectId) || false;
    }

    public resetVisibility(): void {
        this.effectVisibilityState.clear();
    }

}
