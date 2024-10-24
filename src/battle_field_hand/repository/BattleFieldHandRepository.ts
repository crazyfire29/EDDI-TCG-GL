export class BattleFieldHandRepository {
    private static instance: BattleFieldHandRepository;

    private currentHandList: number[] = [2, 8, 19, 20, 93]

    private constructor() { }

    public static getInstance(): BattleFieldHandRepository {
        if (!BattleFieldHandRepository.instance) {
            BattleFieldHandRepository.instance = new BattleFieldHandRepository();
        }

        return BattleFieldHandRepository.instance
    }

    public addBattleFieldHand(hand: number): void {
        this.currentHandList.push(hand)
    }

    public getBattleFieldHandList(): number[] {
        return this.currentHandList
    }
}