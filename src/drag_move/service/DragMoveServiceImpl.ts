import * as THREE from 'three';

import { DragMoveService } from './DragMoveService';
import {DragMoveRepositoryImpl} from "../repository/DragMoveRepositoryImpl";
import {DragMoveRepository} from "../repository/DragMoveRepository";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";

export class DragMoveServiceImpl implements DragMoveService {
    private static instance: DragMoveServiceImpl | null = null;

    private cardPositions = new Map<string, THREE.Vector3>();

    private raycaster: THREE.Raycaster;
    private plane: THREE.Plane;
    private offset: THREE.Vector3;
    private lastPosition: THREE.Vector3;
    private dragMoveRepository: DragMoveRepository;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.raycaster = new THREE.Raycaster();
        this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1));
        this.offset = new THREE.Vector3();
        this.lastPosition = new THREE.Vector3();
        this.dragMoveRepository = DragMoveRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): DragMoveServiceImpl {
        if (!DragMoveServiceImpl.instance) {
            DragMoveServiceImpl.instance = new DragMoveServiceImpl(camera, scene);
        }
        return DragMoveServiceImpl.instance;
    }

    onMouseMove(event: MouseEvent): void {
        const selectedObject = this.dragMoveRepository.getSelectedObject();
        if (!selectedObject) {
            return;
        }

        const cardScene = selectedObject as unknown as BattleFieldCardScene;
        const mesh = cardScene.getMesh();
        if (!mesh) {
            return;
        }

        // 카드 ID를 고유 식별자로 사용 (예: mesh.id)
        const cardId = mesh.id.toString();

        // 마우스 위치 계산
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersection = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
            console.log(`Mouse Intersection: ${intersection.toArray()}`);

            // 카드가 처음 드래그되는 경우
            if (!this.cardPositions.has(cardId)) {
                this.offset.copy(intersection).sub(mesh.position); // 카드와 마우스의 상대 위치 계산
                this.cardPositions.set(cardId, mesh.position.clone()); // 카드의 초기 위치 저장
                console.log(`Initializing drag for card ${cardId}, offset: ${this.offset.toArray()}`);
                return;
            }

            // 새로운 위치 계산 (마우스 위치에서 오프셋 제거)
            const newPosition = intersection.clone().sub(this.offset);

            // 이동 거리 계산 (현재 위치 기준)
            const movement = newPosition.clone().sub(mesh.position);

            // 카드의 위치 갱신
            mesh.position.copy(newPosition);

            // 속성 마크의 위치 갱신
            this.dragMoveRepository.getSelectedGroup().forEach((obj) => {
                const attributeMesh = obj.getMesh();
                if (attributeMesh) {
                    attributeMesh.position.add(movement); // 이동 거리만큼 속성 마크 이동
                    console.log(`Updated attribute mark position to: ${attributeMesh.position.toArray()}`);
                }
            });

            // 마지막 위치 갱신
            this.cardPositions.set(cardId, newPosition.clone());
        }
    }
}
