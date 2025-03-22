export interface MyCardScreenCardClickDetectService {
    setMouseDown(state: boolean): void
    isMouseDown(): boolean
    handleLeftClick(clickPoint: { x: number; y: number }): any | null;
    onMouseDown(event: MouseEvent): Promise<any | null>;
    getCurrentClickedCardId(): number | null;
}
