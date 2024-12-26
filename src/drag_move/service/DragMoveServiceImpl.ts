import * as THREE from 'three';

import { DragMoveService } from './DragMoveService';
import {DragMoveRepositoryImpl} from "../repository/DragMoveRepositoryImpl";
import {DragMoveRepository} from "../repository/DragMoveRepository";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";

export class DragMoveServiceImpl implements DragMoveService {
    private static instance: DragMoveServiceImpl | null = null;

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

        // 마우스 위치 계산
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        console.log(`mouse offset: ${mouse.toArray()}`);

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersection = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
            console.log(`intersection: ${intersection.toArray()}`);

            // 첫 번째 동작 처리
            if (this.lastPosition.equals(new THREE.Vector3(0, 0, 0))) {
                // 첫 번째 동작 시 offset을 현재 intersection과 동일하게 설정
                this.offset.copy(intersection).sub(mesh.position); // 카드와 마우스의 상대 위치 계산
                this.lastPosition.copy(mesh.position);
                console.log("First movement detected, initializing offset and lastPosition.");
                return;
            }

            // 새로운 위치 계산
            const newPosition = intersection.clone().sub(this.offset);
            console.log(`offset: ${this.offset.toArray()}`);
            console.log(`newPosition: ${newPosition.toArray()}`);
            console.log(`this.lastPosition: ${this.lastPosition.toArray()}`);

            // 이동 계산
            const movement = newPosition.clone().sub(this.lastPosition);

            // 카드의 위치 갱신
            mesh.position.copy(newPosition);

            // 속성 마크의 위치 갱신
            this.dragMoveRepository.getSelectedGroup().forEach((obj) => {
                const attributeMesh = obj.getMesh();
                if (attributeMesh) {
                    attributeMesh.position.add(movement); // 이동 거리만큼 속성 마크 이동
                }
            });

            // 마지막 위치 갱신
            this.lastPosition.copy(newPosition);
        }
    }
}
