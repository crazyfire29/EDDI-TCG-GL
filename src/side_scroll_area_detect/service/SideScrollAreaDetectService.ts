export interface SideScrollAreaDetectService {
    setLeftMouseDown(state: boolean): void;
    isLeftMouseDown(): boolean;
    setMyCardScrollAreaDetectState(state: boolean): void;
    getMyCardScrollAreaDetectState(): boolean;
    detectMakeDeckSideScrollArea(detectPoint: { x: number; y: number }): Promise<any | null>;
    detectMyCardSideScrollArea(detectPoint: { x: number; y: number }): Promise<any | null>
    onMouseMove(event: MouseEvent): Promise<void>;
    onMouseMoveMyCard(event: MouseEvent): Promise<void>;
    getScrollEnabled(): boolean;
    getMakeDeckScrollEnabledById(areaId: number): boolean;
    getMyCardScrollEnabled(): boolean;
}
