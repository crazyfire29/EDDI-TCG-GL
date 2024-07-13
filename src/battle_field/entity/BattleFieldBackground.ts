import { Vector2d } from '../../common/math/Vector2d';

export class BattleFieldBackground {
    private width: number;
    private height: number;
    private imagePath: string;
    private localTranslationPosition: Vector2d;

    constructor(width: number, height: number, imagePath: string, position: Vector2d) {
        this.width = width;
        this.height = height;
        this.imagePath = imagePath;
        this.localTranslationPosition = position;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getImagePath(): string {
        return this.imagePath;
    }

    public getLocalTranslationPosition(): Vector2d {
        return this.localTranslationPosition;
    }

    public setLocalTranslationPosition(position: Vector2d): void {
        this.localTranslationPosition = position;
    }

    public setScale(scaleX: number, scaleY: number): void {
        this.width *= scaleX;
        this.height *= scaleY;
    }
}
