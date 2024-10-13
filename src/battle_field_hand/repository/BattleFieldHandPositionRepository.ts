import {Vector2d} from "../../common/math/Vector2d";
import {UserWindowSize} from "../../window_size/WindowSize";

export class BattleFieldHandPositionRepository {
    private static instance: BattleFieldHandPositionRepository;

    private currentHandPositionList: Vector2d[] = []
    private gapOfEachHand: number = 0.094696
    private startX: number = 0
    private endX: number = 0
    private HALF: number = 0.5
    private xCriteria: number = 0.311904
    private yCriteria: number = 0.870624
    private initialX: number = this.xCriteria - this.HALF
    private initialY: number = this.HALF - this.yCriteria

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

        // console.log('screenWidth:', screenWidth)
        // console.log('screenHeight:', screenHeight)

        const userWindowSize = UserWindowSize.getInstance();
        const { scaleX, scaleY } = userWindowSize.getScaleFactors();

        // (873, 945), (539, 761)
        // (539, 742), (541, 774)
        // (1848, 949)

        // 941 / 968 = 0.97210743801
        // 842 / 968 = 0.869834

        // const currentWidth = window.innerWidth
        // const cardWidth = 0.06493506493 * currentWidth
        // const cardHeight = cardWidth * 1.615;
        // 0.06493506493 * 1.615 = 0.10487012986
        // 대략 0.97210743801 에서 0.869834 을 뺀 값임

        // 실제 cardWidth * 1.615에 해당하는 중간 위치가 비율로 계산되어야함
        // 그리고 더 명확한 지표는 카드 중앙값의 높이 + 카드 길이의 절반이 941 / 968 = 0.97210743801 이 구간에 들어오게 하는 것이 더 정확함
        // 카드에 한정하여 width 값에 맞춰 height를 1.615로 구성하는 것이 스케일 상황에 더 좋아보임

        // screenHeight: 654
        //
        // Mouse clicked at: (436, 620)
        // Mouse clicked at: (526, 570)
        //
        // 620 / 654 = 0.948012 대략적
        // 570 / 654 = 0.871559 대략적
        //
        // 0.948012 - 0.871559 = 0.076453
        //
        // cardHeight의 끝 0.972107
        //
        // cardWidth = 0.06493506493
        //
        // const cardWidth = 0.06493506493 * currentWidth
        // const cardHeight = cardWidth * 1.615;
        //
        // 0.06493506493 * 1.615 = 0.1048701
        //
        // HandScene scaleY: 0.7039827771797632
        //
        // 0.076453 = 0.1048701 * 0.7039827771797632 = 0.07382674424
        //
        // cardEnd = 0.972107
        // cardHeightLineCenter = cardEnd - scaleY * cardHeight
        // cardHeightPosition = 0.5 - cardHeightLineCenter

        // const initialX: number = this.xCriteria * scaleX - this.HALF
        // const initialY: number = this.HALF - this.yCriteria * scaleY

        // const scaledX = ((this.initialX * scaleX) + (this.count * this.gapOfEachHand * scaleX)) * screenWidth;
        // const scaled = (this.initialX + this.count * this.gapOfEachHand) * screenWidth;
        // const scaledY = this.HALF + (this.initialY * scaleY) * screenWidth;
        // const x = (this.initialX + this.count * this.gapOfEachHand) * screenWidth;
        // const y = this.initialY * screenHeight;
        // const scaledX = (initialX + this.count * this.gapOfEachHand) * screenWidth;
        // const scaledY = initialY * screenHeight;

        // const scaledX = ((this.initialX * scaleX) + (this.count * this.gapOfEachHand * scaleX)) * screenWidth;
        // const scaledY = 0.5 - (0.972107 - 0.06493506493 * 1.615 * scaleY) * screenHeight

        const scaledX = (this.initialX + this.count * this.gapOfEachHand) * screenWidth;
        const scaledY = (0.5 - (0.972107 - 0.06493506493 * 1.615 * scaleY)) * screenHeight;

        console.log('addBattleFieldHandPosition -> scaledX, scaledY:', scaledX, scaledY)
        const position = new Vector2d(scaledX, scaledY);
        // const position = new Vector2d(x, y);
        this.currentHandPositionList.push(position);

        this.count++

        return position
    }

    public getBattleFieldHandPositionList(): Vector2d[] {
        return this.currentHandPositionList
    }
}