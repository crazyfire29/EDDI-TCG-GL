import * as THREE from 'three';

export class RectangleBoundsManager {
    private rectangle: THREE.Mesh;

    constructor(rectangle: THREE.Mesh) {
        this.rectangle = rectangle;
    }

    /**
     * 사각형의 경계 영역을 계산합니다.
     * @returns {THREE.Box2} 사각형의 경계 영역
     */
    public calculateBounds(): THREE.Box2 {
        const rectanglePosition = this.rectangle.position;
        const rectangleScale = this.rectangle.scale;
        const geometry = this.rectangle.geometry as THREE.PlaneGeometry;

        const rectWidth = geometry.parameters.width * rectangleScale.x;
        const rectHeight = geometry.parameters.height * rectangleScale.y;

        const minX = rectanglePosition.x - rectWidth / 2;
        const maxX = rectanglePosition.x + rectWidth / 2;
        const minY = rectanglePosition.y - rectHeight / 2;
        const maxY = rectanglePosition.y + rectHeight / 2;

        return new THREE.Box2(
            new THREE.Vector2(minX, minY),
            new THREE.Vector2(maxX, maxY)
        );
    }

    /**
     * 주어진 좌표가 사각형 내부에 있는지 확인합니다.
     * @param {THREE.Vector2} position 확인할 좌표
     * @returns {boolean} 내부에 있으면 true, 아니면 false
     */
    public isPointInside(position: THREE.Vector2): boolean {
        const bounds = this.calculateBounds();
        return bounds.containsPoint(position);
    }
}
