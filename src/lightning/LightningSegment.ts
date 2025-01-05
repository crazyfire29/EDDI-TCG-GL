import * as THREE from 'three';

export class LightningSegment {
    private start: THREE.Vector3;
    private end: THREE.Vector3;
    private material: THREE.LineBasicMaterial;

    constructor(start: THREE.Vector3, end: THREE.Vector3) {
        this.start = start;
        this.end = end;
        this.material = new THREE.LineBasicMaterial({ color: 0x00ffff }); // 청록색 번개
    }

    public createSegment(): THREE.Line {
        const geometry = new THREE.BufferGeometry().setFromPoints([this.start, this.end]);
        return new THREE.Line(geometry, this.material);
    }
}
