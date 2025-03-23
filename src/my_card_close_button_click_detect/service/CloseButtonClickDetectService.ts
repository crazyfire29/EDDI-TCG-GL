export interface CloseButtonClickDetectService {
    setCloseButtonClickState(state: boolean): void;
    getCloseButtonClickState(): boolean;
    handleCloseButtonClickEvent(clickPoint: { x: number; y: number }): Promise<any | null>;
    onMouseDown(event: MouseEvent): Promise<any | null>;
}
