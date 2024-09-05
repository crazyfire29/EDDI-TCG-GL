import {Vector2d} from "../../common/math/Vector2d";

export class BattleFieldHandPositionRepository {
    private static instance: BattleFieldHandPositionRepository;

    private currentHandPositionList: Vector2d[] = []
    private gapOfEachHand: number = 0.094696
    private startX: number = 0
    private endX: number = 0
    private initialX: number = 0.311904 - 0.5
    private initialY: number = 0.5 - 0.870624

    private count: number = 0

    private constructor() { }

    public static getInstance(): BattleFieldHandPositionRepository {
        if (!BattleFieldHandPositionRepository.instance) {
            BattleFieldHandPositionRepository.instance = new BattleFieldHandPositionRepository();
        }

        return BattleFieldHandPositionRepository.instance
    }

    public addBattleFieldHandPosition(): Vector2d {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        console.log('screenWidth:', screenWidth)
        console.log('screenHeight:', screenHeight)

        const x = (this.initialX + this.count * this.gapOfEachHand) * screenWidth;
        const y = this.initialY * screenHeight;

        console.log('x:', x)
        console.log('y:', y)

        const position = new Vector2d(x, y);
        this.currentHandPositionList.push(position);

        this.count++

        return position
    }

    public getBattleFieldHandPositionList(): Vector2d[] {
        return this.currentHandPositionList
    }
}