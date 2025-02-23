export interface SelectedCardBlockHoverDetectService {
    setLeftMouseDown(state: boolean): void
    isLeftMouseDown(): boolean
    handleMouseOver(hoverPoint: { x: number; y: number }): Promise<any | null>;
    handleMouseOut(hoverPoint: { x: number; y: number }): Promise<any | null>;
    onMouseOver(event: MouseEvent): Promise<any | null>;
    onMouseOut(event: MouseEvent): Promise<any | null>;
}
