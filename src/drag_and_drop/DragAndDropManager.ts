import * as THREE from "three";
import {NonBackgroundImage} from "../shape/image/NonBackgroundImage";

export class DragAndDropManager {
    private static instance: DragAndDropManager;
    private selectedObject: THREE.Object3D | null = null;
    private offset = new THREE.Vector3();
    private lastPosition = new THREE.Vector3();
    private selectedGroup: THREE.Object3D[] = [];
    private isDragging = false;
    private raycaster = new THREE.Raycaster();
    private plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    private background: NonBackgroundImage | null = null; // 배경 객체를 설정할 변수

    private targetShape: THREE.Object3D | null = null;

    private originalPositionMap: Map<THREE.Object3D, THREE.Vector3> = new Map();

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {}

    public static getInstance(camera: THREE.Camera, scene: THREE.Scene): DragAndDropManager {
        if (!DragAndDropManager.instance) {
            DragAndDropManager.instance = new DragAndDropManager(camera, scene);
        }
        return DragAndDropManager.instance;
    }

    // 배경을 설정하는 메소드
    public setBackground(backgroundObject: NonBackgroundImage | null): void {
        this.background = backgroundObject;
    }

    public setTargetShape(targetShape: THREE.Object3D | null): void {
        this.targetShape = targetShape;
    }

    public onMouseDown(event: MouseEvent): void {
        const mouse = this.getNormalizedMouseCoords(event);
        this.raycaster.setFromCamera(mouse, this.camera);

        console.log('this.background?.getMesh():', this.background?.getMesh());
        const intersects = this.raycaster.intersectObjects(
            this.scene.children.filter(child => child !== this.background?.getMesh())
        );

        console.log('intersects:', intersects)

        if (intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            console.log('Selected Object:', this.selectedObject);

            // 저장: 선택된 객체와 관련된 모든 객체의 위치 저장
            this.lastPosition.copy(this.selectedObject.position);
            this.selectedGroup = this.getAssociatedObjects(this.selectedObject);

            console.log('Selected Group:', this.selectedGroup);

            // 선택된 객체의 위치와 그룹 내 모든 객체들의 위치 저장
            this.originalPositionMap.set(this.selectedObject, this.lastPosition.clone());
            this.selectedGroup.forEach((obj) => {
                this.originalPositionMap.set(obj, obj.position.clone());
            });

            this.offset.copy(intersects[0].point).sub(this.lastPosition);
            this.isDragging = true;

            console.log('Offset:', this.offset);
        } else {
            console.log('No object selected at mouse down');
        }
    }

    public onMouseMove(event: MouseEvent): void {
        if (this.isDragging && this.selectedObject) {
            const mouse = this.getNormalizedMouseCoords(event);

            this.raycaster.setFromCamera(mouse, this.camera);
            const intersection = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(this.plane, intersection);

            console.log('Mouse move intersection:', intersection);

            const newPosition = intersection.sub(this.offset);
            console.log('New Position:', newPosition);

            this.selectedObject.position.copy(newPosition);

            const movement = newPosition.clone().sub(this.lastPosition);
            console.log('Movement vector:', movement);

            this.selectedGroup.forEach((obj) => {
                obj.position.add(movement.clone());
                console.log('Object moved:', obj);
            });

            this.lastPosition.copy(newPosition);
        }
    }

    public onMouseUp(): void {
        this.isDragging = false;

        // 드래그된 객체가 타겟 객체 안에 있는지 체크
        if (this.selectedObject && this.targetShape) {
            const intersects = this.raycaster.intersectObject(this.targetShape);
            console.log('Raycast intersects with targetShape:', intersects);

            if (intersects.length > 0) {
                console.log("Dropped inside the target shape");
            } else {
                console.log("Dropped outside the target shape");

                // 원래 위치로 복원
                const originalPosition = this.originalPositionMap.get(this.selectedObject);
                if (originalPosition) {
                    this.selectedObject.position.copy(originalPosition); // 원래 위치로 되돌리기
                    console.log("Object returned to original position:", originalPosition);

                    // 그룹에 속한 객체들도 원래 위치로 되돌리기
                    this.selectedGroup.forEach((obj) => {
                        const originalObjPosition = this.originalPositionMap.get(obj);
                        if (originalObjPosition) {
                            obj.position.copy(originalObjPosition); // 원래 위치로 되돌리기
                            console.log("Group object returned to original position:", originalObjPosition);
                        } else {
                            console.log("No original position stored for group object:", obj);
                        }
                    });
                } else {
                    console.log("No original position found for selectedObject");
                }
            }
        }

        // 선택된 객체와 그룹 초기화
        this.selectedObject = null;
        this.selectedGroup = [];
        this.lastPosition.set(0, 0, 0);

        console.log('Selection cleared. selectedObject:', this.selectedObject, 'selectedGroup:', this.selectedGroup);
    }

    private getAssociatedObjects(object: THREE.Object3D): THREE.Object3D[] {
        const associatedObjects: THREE.Object3D[] = [];
        if (object.parent) {
            object.parent.children.forEach(child => {
                if (child !== object) {
                    associatedObjects.push(child);
                }
            });
        }
        return associatedObjects;
    }

    private getNormalizedMouseCoords(event: MouseEvent): THREE.Vector2 {
        return new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
    }
}
