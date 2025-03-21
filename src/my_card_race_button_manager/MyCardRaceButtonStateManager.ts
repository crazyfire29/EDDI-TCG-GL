import {MyCardRaceButton} from "../my_card_race_button/entity/MyCardRaceButton";
import {MyCardRaceButtonRepositoryImpl} from "../my_card_race_button/repository/MyCardRaceButtonRepositoryImpl";

export class MyCardRaceButtonStateManager {
    private static instance: MyCardRaceButtonStateManager | null = null;
    private raceButtonVisibilityState: Map<number, boolean>;
    private myCardRaceButtonRepository: MyCardRaceButtonRepositoryImpl;

    constructor() {
        this.raceButtonVisibilityState = new Map();
        this.myCardRaceButtonRepository = MyCardRaceButtonRepositoryImpl.getInstance();
    }

    public static getInstance(): MyCardRaceButtonStateManager {
        if (!MyCardRaceButtonStateManager.instance) {
            MyCardRaceButtonStateManager.instance = new MyCardRaceButtonStateManager();
        }
        return MyCardRaceButtonStateManager.instance;
    }

    public setVisibility(buttonId: number, isVisible: boolean): void {
        this.raceButtonVisibilityState.set(buttonId, isVisible);
        if (isVisible == true) {
            this.myCardRaceButtonRepository.showButton(buttonId);
        } else {
            this.myCardRaceButtonRepository.hideButton(buttonId);
        }
    }

    public findVisibility(buttonId: number): boolean {
        return this.raceButtonVisibilityState.get(buttonId) || false;
    }

    public resetVisibility(): void {
        this.raceButtonVisibilityState.clear();
    }

}
