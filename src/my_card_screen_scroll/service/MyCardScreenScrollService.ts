import * as THREE from "three";

export interface MyCardScreenScrollService {
    setScrollState(state: boolean): void;
    getScrollState(): boolean;
    onWheelScroll(event: WheelEvent, currentClickRaceButtonId: number): Promise<void>;
    getCurrentClickedRaceButtonId(): number | null;
    getCardCountByRaceId(raceButtonId: number): number;
}
