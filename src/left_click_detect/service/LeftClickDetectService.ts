export interface LeftClickDetectService {
    handleLeftClick(
        clickPoint: { x: number; y: number },
    ): any | null;
}
