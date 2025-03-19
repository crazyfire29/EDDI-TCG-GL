export interface MakeDeckScreenDoneButtonClickDetectService {
    setLeftMouseDown(state: boolean): void;
    isLeftMouseDown(): boolean;
    setDeactivationButtonClick(state: boolean): void;
    isDeactivationButtonClick(): boolean;
    setActivationButtonClick(state: boolean): void;
    isActivationButtonClick(): boolean;
//     handleLeftClick(
//         clickPoint: { x: number; y: number },
//     ): any | null;
//     onMouseDown(event: MouseEvent): Promise<any | null>;
    deactivationDoneButtonClick(clickPoint: { x: number; y: number }): Promise<any | null>;
    activationDoneButtonClick(clickPoint: { x: number; y: number }): Promise<any | null>;
    onMouseDownForDeactivation(event: MouseEvent): Promise<any | null>;
    onMouseDownForActivation(event: MouseEvent): Promise<any | null>;
}
