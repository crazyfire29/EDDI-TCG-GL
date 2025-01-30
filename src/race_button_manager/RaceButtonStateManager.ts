import {RaceButton} from "../race_button/entity/RaceButton";
import {RaceButtonRepositoryImpl} from "../race_button/repository/RaceButtonRepositoryImpl";

export class RaceButtonStateManager {
    private static instance: RaceButtonStateManager | null = null;
    private raceButtonVisibilityState: Map<number, boolean>;
    private raceButtonRepository: RaceButtonRepositoryImpl;

    constructor() {
        this.raceButtonVisibilityState = new Map();
        this.raceButtonRepository = RaceButtonRepositoryImpl.getInstance();
    }

    public static getInstance(): RaceButtonStateManager {
        if (!RaceButtonStateManager.instance) {
            RaceButtonStateManager.instance = new RaceButtonStateManager();
        }
        return RaceButtonStateManager.instance;
    }

    public setVisibility(buttonId: number, isVisible: boolean): void {
        this.raceButtonVisibilityState.set(buttonId, isVisible);
        if (isVisible == true) {
            this.raceButtonRepository.showRaceButton(buttonId);
        } else {
            this.raceButtonRepository.hideRaceButton(buttonId);
        }
    }

    public findVisibility(buttonId: number): boolean {
        return this.raceButtonVisibilityState.get(buttonId) || false;
    }

    public resetVisibility(): void {
        this.raceButtonVisibilityState.clear();
    }

}
