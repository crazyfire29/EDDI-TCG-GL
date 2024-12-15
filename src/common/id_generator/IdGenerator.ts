export class IdGenerator {
    private static currentId: number = 0;

    static generateId(): number {
        return ++this.currentId;
    }
}