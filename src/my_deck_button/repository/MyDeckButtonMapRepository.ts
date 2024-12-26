export interface MyDeckButtonMapRepository {
    addMyDeck(deckId: number): void
    getMyDeckList(): number[]
    getMyDeckIdByIndex(index: number): number | undefined
    removeMyDeck(index: number): void
}