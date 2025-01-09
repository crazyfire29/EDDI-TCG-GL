export interface MyDeckCardMapRepository {
    addMyDeckCard(deckId: number, cardIdList: number[]): void;
    getDeckIdAndCardLists(): [number, number[]][]
}