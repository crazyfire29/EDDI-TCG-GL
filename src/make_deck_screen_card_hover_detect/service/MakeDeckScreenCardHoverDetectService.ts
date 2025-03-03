export interface MakeDeckScreenCardHoverDetectService {
    setMouseMove(state: boolean): void
    isMouseMove(): boolean
    handleHover(
        hoverPoint: { x: number; y: number },
    ): any | null;
    onMouseMove(event: MouseEvent): Promise<any | null>;
    getCurrentHoveredCardId(): number | null;
}
