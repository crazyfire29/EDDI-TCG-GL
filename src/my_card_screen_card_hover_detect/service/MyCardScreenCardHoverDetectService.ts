export interface MyCardScreenCardHoverDetectService {
    setCardDetectState(state: boolean): void
    getCardDetectState(): boolean
    handleHover(hoverPoint: { x: number; y: number }): any | null;
    onMouseMove(event: MouseEvent): Promise<any | null>;
    getCurrentHoveredCardId(): number | null;
}
