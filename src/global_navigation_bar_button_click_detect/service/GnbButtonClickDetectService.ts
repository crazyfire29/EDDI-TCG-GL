export interface GnbButtonClickDetectService {
    setButtonClickDetectState(state: boolean): void
    getButtonClickDetectState(): boolean
    handleClick(clickPoint: { x: number; y: number }): any | null;
    onMouseDown(event: MouseEvent): Promise<any | null>;
}
