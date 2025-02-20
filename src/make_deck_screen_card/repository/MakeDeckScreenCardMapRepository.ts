export interface MakeDeckScreenCardMapRepository {
    getCurrentMakeDeckScreenCardMap(): Map<number, number>;
    addMakeDeckScreenCard(cardId: number, cardCount: number): void;
    getCardIdList(): number[];
    getCardCountList(): number[];
}