export interface BlockDeleteButtonClickDetectService {
    setMouseDown(state: boolean): void;
    isMouseDown(): boolean;
    handleButtonClick(clickPoint: { x: number; y: number }): Promise<any | null>;
    onMouseDown(event: MouseEvent): Promise<any | null>;
    getCurrentClickedButtonId(): number | null;
}
