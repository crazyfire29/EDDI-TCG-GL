export interface SideScrollService {
    setLeftMouseDown(state: boolean): void;
    isLeftMouseDown(): boolean;
    detectSideScrollArea(
        detectPoint: { x: number; y: number },
    ): any | null;
    onMouseMove(event: MouseEvent): Promise<void>;
}
