export interface MyCardRaceButtonClickDetectService {
    setLeftMouseDown(state: boolean): void;
    isLeftMouseDown(): boolean;
    handleRaceButtonClick(clickPoint: { x: number; y: number }): any | null;
    onMouseDown(event: MouseEvent): Promise<any | null>;
}
