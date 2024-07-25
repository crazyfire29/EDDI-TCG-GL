import { BattleFieldBackgroundRepository } from '../repository/BattleFieldBackgroundRepository';
import { BattleFieldBackground } from '../entity/BattleFieldBackground';
import { Vector2d } from '../../common/math/Vector2d';

export class BattleFieldBackgroundService {
    private static instance: BattleFieldBackgroundService;
    private repository: BattleFieldBackgroundRepository;

    private constructor() {
        this.repository = BattleFieldBackgroundRepository.getInstance();
    }

    public static getInstance(): BattleFieldBackgroundService {
        if (!BattleFieldBackgroundService.instance) {
            BattleFieldBackgroundService.instance = new BattleFieldBackgroundService();
        }
        return BattleFieldBackgroundService.instance;
    }

    public createBackground(width: number, height: number, imagePath: string, position: Vector2d): BattleFieldBackground {
        const background = new BattleFieldBackground(width, height, imagePath, position);
        this.repository.setBackground(background);
        return background;
    }

    public getBackground(): BattleFieldBackground | null {
        return this.repository.getBackground();
    }
}
