export class Vector2d {
    private x: number
    private y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }

    public setVector2d(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    public add(vector: Vector2d): Vector2d {
        this.x += vector.x;
        this.y += vector.y;

        return this
    }

    public subtract(vector: Vector2d): Vector2d {
        this.x -= vector.x;
        this.y -= vector.y;

        return this
    }

    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}