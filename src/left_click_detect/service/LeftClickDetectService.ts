export interface LeftClickDetectService {
    setLeftMouseDown(state: boolean): void
    isLeftMouseDown(): boolean
    handleLeftClick(
        clickPoint: { x: number; y: number },
    ): any | null;
}
