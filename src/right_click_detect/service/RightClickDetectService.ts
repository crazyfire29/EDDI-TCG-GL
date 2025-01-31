export interface RightClickDetectService {
    setRightMouseDown(state: boolean): void
    isRightMouseDown(): boolean
    handleRightClick(
        clickPoint: { x: number; y: number },
    ): any | null;
}
