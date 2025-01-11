export interface DeckCardPageMoveButtonClickDetectService {
    setLeftMouseDown(state: boolean): void
    isLeftMouseDown(): boolean
    handleLeftClick(
        deckId: number,
        clickPoint: { x: number; y: number },
    ): any | null;
    onMouseDown(event: MouseEvent, deckId: number): Promise<void>;
}
