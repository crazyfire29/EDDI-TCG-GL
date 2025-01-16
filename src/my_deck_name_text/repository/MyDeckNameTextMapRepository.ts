export interface MyDeckNameTextMapRepository {
    addMyDeckNameText(deckId: number, deckName: string): void;
    getMyDeckNameTextList(): string[];
}