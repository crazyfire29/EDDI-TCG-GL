import * as THREE from 'three';
import { LightningSegment } from './LightningSegment';

export class LightningGenerator {
    private numSegments: number;

    constructor(numSegments: number = 10) {
        this.numSegments = numSegments; // 번개의 세그먼트 개수
    }

    public generateLightning(start: THREE.Vector3, end: THREE.Vector3): THREE.Line[] {
        const segments: THREE.Line[] = [];
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const segmentLength = start.distanceTo(end) / this.numSegments;

        let currentPoint = start.clone();
        for (let i = 0; i < this.numSegments; i++) {
            // 랜덤한 변형을 추가
            const offset = new THREE.Vector3(
                (Math.random() - 0.5) * segmentLength,
                (Math.random() - 0.5) * segmentLength,
                (Math.random() - 0.5) * segmentLength
            );

            const nextPoint = currentPoint.clone().add(direction.clone().multiplyScalar(segmentLength)).add(offset);
            const segment = new LightningSegment(currentPoint, nextPoint);
            segments.push(segment.createSegment());

            currentPoint = nextPoint;
        }

        return segments;
    }
}
