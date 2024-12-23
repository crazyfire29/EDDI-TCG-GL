import { LeftClickDetectService } from "./LeftClickDetectService";

export class LeftClickDetectServiceImpl implements LeftClickDetectService {
    private static instance: LeftClickDetectServiceImpl | null = null;

    private constructor() {}

    static getInstance(): LeftClickDetectServiceImpl {
        if (!LeftClickDetectServiceImpl.instance) {
            LeftClickDetectServiceImpl.instance = new LeftClickDetectServiceImpl();
        }
        return LeftClickDetectServiceImpl.instance;
    }

    handleLeftClick(
        clickPoint: { x: number; y: number },
    ): any | null {
        const { x, y } = clickPoint;
        const adjustedY = window.innerHeight - y;

        // 1. Handle hand card area
        const clickedHandCard = this.whichOneSelectIsInYourHandListArea(
            { x, y: adjustedY },
        );
        if (clickedHandCard) return clickedHandCard;

        // Add additional detection logic here...
        return null;
    }

    private whichOneSelectIsInYourHandListArea(
        clickPoint: { x: number; y: number },
    ): any | null {
        return null;
    }
}
