import * as THREE from "three";

export interface MyCardScreenScrollService {
    onWheelScroll(event: WheelEvent, currentClickRaceButtonId: number): Promise<void>;
    getCurrentClickedRaceButtonId(): number | null;
    getCardCountByRaceId(raceButtonId: number): number;
}
