export interface GnbButtonHoverDetectService {
    setButtonHoverDetectState(state: boolean): void
    getButtonHoverDetectState(): boolean
    handleHover(hoverPoint: { x: number; y: number }): any | null;
    onMouseMove(event: MouseEvent): Promise<any | null>;
    getCurrentHoveredButtonId(): number | null;
}
