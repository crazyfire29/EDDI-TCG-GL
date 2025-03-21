export interface SideScrollAreaDetectService {
    setLeftMouseDown(state: boolean): void;
    isLeftMouseDown(): boolean;
    detectMakeDeckSideScrollArea(detectPoint: { x: number; y: number }): Promise<any | null>;
    onMouseMove(event: MouseEvent): Promise<void>;
    getScrollEnabled(): boolean;
    getMakeDeckScrollEnabledById(areaId: number): boolean;
}
