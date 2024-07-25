import { BattleFieldBackground } from '../entity/BattleFieldBackground';

export class BattleFieldBackgroundRepository {
    private static instance: BattleFieldBackgroundRepository;

    private background: BattleFieldBackground | null = null;

    private constructor() { }

    public static getInstance(): BattleFieldBackgroundRepository {
        if (!BattleFieldBackgroundRepository.instance) {
            BattleFieldBackgroundRepository.instance = new BattleFieldBackgroundRepository();
        }

        return BattleFieldBackgroundRepository.instance;
    }

    public setBackground(background: BattleFieldBackground): void {
        this.background = background;
    }

    public getBackground(): BattleFieldBackground | null {
        return this.background;
    }
}
