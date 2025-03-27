import {GlobalNavigationBar} from "../global_navigation_bar/entity/GlobalNavigationBar";
import {GlobalNavigationBarRepositoryImpl} from "../global_navigation_bar/repository/GlobalNavigationBarRepositoryImpl";

export class GlobalNavigationBarStateManager {
    private static instance: GlobalNavigationBarStateManager | null = null;
    private buttonVisibilityState: Map<number, boolean>;
    private globalNavigationBarRepository: GlobalNavigationBarRepositoryImpl;

    constructor() {
        this.buttonVisibilityState = new Map();
        this.globalNavigationBarRepository = GlobalNavigationBarRepositoryImpl.getInstance();
    }

    public static getInstance(): GlobalNavigationBarStateManager {
        if (!GlobalNavigationBarStateManager.instance) {
            GlobalNavigationBarStateManager.instance = new GlobalNavigationBarStateManager();
        }
        return GlobalNavigationBarStateManager.instance;
    }

    public setVisibility(buttonId: number, isVisible: boolean): void {
        this.buttonVisibilityState.set(buttonId, isVisible);
        if (isVisible == true) {
            this.globalNavigationBarRepository.showButton(buttonId);
        } else {
            this.globalNavigationBarRepository.hideButton(buttonId);
        }
    }

    public findVisibility(effectId: number): boolean {
        return this.buttonVisibilityState.get(effectId) || false;
    }

    public resetVisibility(): void {
        this.buttonVisibilityState.clear();
    }

}
