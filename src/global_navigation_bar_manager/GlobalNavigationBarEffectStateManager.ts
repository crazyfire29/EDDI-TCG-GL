import {GlobalNavigationBarEffect} from "../global_navigation_bar_effect/entity/GlobalNavigationBarEffect";
import {GlobalNavigationBarEffectRepositoryImpl} from "../global_navigation_bar_effect/repository/GlobalNavigationBarEffectRepositoryImpl";

export class GlobalNavigationBarEffectStateManager {
    private static instance: GlobalNavigationBarEffectStateManager | null = null;
    private effectVisibilityState: Map<number, boolean>;
    private globalNavigationBarEffectRepository: GlobalNavigationBarEffectRepositoryImpl;

    constructor() {
        this.effectVisibilityState = new Map();
        this.globalNavigationBarEffectRepository = GlobalNavigationBarEffectRepositoryImpl.getInstance();
    }

    public static getInstance(): GlobalNavigationBarEffectStateManager {
        if (!GlobalNavigationBarEffectStateManager.instance) {
            GlobalNavigationBarEffectStateManager.instance = new GlobalNavigationBarEffectStateManager();
        }
        return GlobalNavigationBarEffectStateManager.instance;
    }

    public setVisibility(effectId: number, isVisible: boolean): void {
        this.effectVisibilityState.set(effectId, isVisible);
        if (isVisible == true) {
            this.globalNavigationBarEffectRepository.showButton(effectId);
        } else {
            this.globalNavigationBarEffectRepository.hideButton(effectId);
        }
    }

    public findVisibility(effectId: number): boolean {
        return this.effectVisibilityState.get(effectId) || false;
    }

    public resetVisibility(): void {
        this.effectVisibilityState.clear();
    }

}
