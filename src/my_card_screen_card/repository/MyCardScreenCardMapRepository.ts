export interface MyCardScreenCardMapRepository {
    getCurrentMyCardScreenCardMap(): Map<number, number>;
    addMyCardScreenCard(cardId: number, cardCount: number): void;
    getCardIdList(): number[];
    getCardCountList(): number[];
}