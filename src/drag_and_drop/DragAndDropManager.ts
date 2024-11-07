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
            this.lastPosition.copy(this.selectedObject.position);
            this.selectedGroup = this.getAssociatedObjects(this.selectedObject);

            this.offset.copy(intersects[0].point).sub(this.lastPosition);
            this.isDragging = true;
        }
    }

    public onMouseMove(event: MouseEvent): void {
        if (this.isDragging && this.selectedObject) {
            const mouse = this.getNormalizedMouseCoords(event);

            this.raycaster.setFromCamera(mouse, this.camera);
            const intersection = new THREE.Vector3();
            this.raycaster.ray.intersectPlane(this.plane, intersection);

            const newPosition = intersection.sub(this.offset);

            this.selectedObject.position.copy(newPosition);

            const movement = newPosition.clone().sub(this.lastPosition);
            this.selectedGroup.forEach((obj) => {
                obj.position.add(movement.clone());
            });

            this.lastPosition.copy(newPosition);
        }
    }

    public onMouseUp(): void {
        this.isDragging = false;
        this.selectedObject = null;
        this.selectedGroup = [];
        this.lastPosition.set(0, 0, 0);
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
