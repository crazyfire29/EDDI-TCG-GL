import * as THREE from 'three';

export class LightningSegment {
    private start: THREE.Vector3;
    private end: THREE.Vector3;
    private material: THREE.MeshStandardMaterial;

    private readonly LINE_WIDTH = 5

    constructor(start: THREE.Vector3, end: THREE.Vector3) {
        this.start = start;
        this.end = end;

        const color = 0x3137FD

        this.material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        }); // 청록색 번개
    }

    public createSegment(): THREE.Mesh {
        const direction = new THREE.Vector3().subVectors(this.end, this.start);
        const length = direction.length();
        direction.normalize(); // 방향 벡터를 단위 벡터로 정규화

        // PlaneGeometry로 선을 나타내는 얇은 사각형 기하학 생성
        const geometry = new THREE.PlaneGeometry(length, this.LINE_WIDTH);

        // 회전 각도 계산
        const angle = Math.atan2(direction.y, direction.x);

        // PlaneMesh 생성
        const segment = new THREE.Mesh(geometry, this.material);
        segment.rotation.z = angle;  // 선의 회전 적용
        segment.position.copy(this.start.clone().add(direction.multiplyScalar(length / 2)));

        return segment;
    }
}
