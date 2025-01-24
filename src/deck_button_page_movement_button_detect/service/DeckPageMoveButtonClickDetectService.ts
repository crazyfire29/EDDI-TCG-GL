export interface DeckPageMovementButtonClickDetectService {
    setLeftMouseDown(state: boolean): void
    isLeftMouseDown(): boolean
    handleLeftClick(
        clickPoint: { x: number; y: number },
    ): any | null;
    onMouseDown(event: MouseEvent): Promise<void>
}
