export interface MyCardRaceButtonClickDetectService {
    setButtonClickState(state: boolean): void;
    getButtonClickState(): boolean;
    handleRaceButtonClick(clickPoint: { x: number; y: number }): any | null;
    onMouseDown(event: MouseEvent): Promise<any | null>;
}
