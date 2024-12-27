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
        if (!selectedObject) return;

        const cardScene = selectedObject as unknown as BattleFieldCardScene;
        const mesh = cardScene.getMesh();
        if (!mesh) return;

        const cardId = mesh.id.toString();
        const intersection = this.calculateMouseIntersection(event);

        if (!intersection) return;

        if (!this.cardPositions.has(cardId)) {
            this.initializeCardPosition(cardId, mesh, intersection);
        } else {
            this.updateCardPosition(cardId, mesh, intersection);
        }
    }

    private calculateMouseIntersection(event: MouseEvent): THREE.Vector3 | null {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.camera);

        const intersection = new THREE.Vector3();
        if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
            return intersection;
        }

        return null;
    }

    private initializeCardPosition(cardId: string, mesh: THREE.Mesh, intersection: THREE.Vector3): void {
        this.offset.copy(intersection).sub(mesh.position);
        this.cardPositions.set(cardId, mesh.position.clone());
        console.log(`Initialized drag for card ${cardId} with offset: ${this.offset.toArray()}`);
    }

    private updateCardPosition(cardId: string, mesh: THREE.Mesh, intersection: THREE.Vector3): void {
        const newPosition = intersection.clone().sub(this.offset);
        const movement = newPosition.clone().sub(mesh.position);

        mesh.position.copy(newPosition);
        this.updateAttributeMarks(movement);

        this.cardPositions.set(cardId, newPosition.clone());
        console.log(`Updated card ${cardId} position to: ${newPosition.toArray()}`);
    }

    private updateAttributeMarks(movement: THREE.Vector3): void {
        this.dragMoveRepository.getSelectedGroup().forEach((obj) => {
            const attributeMesh = obj.getMesh();
            if (attributeMesh) {
                attributeMesh.position.add(movement);
                console.log(`Updated attribute mark position to: ${attributeMesh.position.toArray()}`);
            }
        });
    }
}
