export class IdGenerator {
    private static counters: { [key: string]: number } = {};

    static generateId(entityType: string): number {
        if (!this.counters[entityType]) {
            this.counters[entityType] = 0;
        }
        this.counters[entityType]++;
        return this.counters[entityType];
    }
}
