import * as THREE from 'three';
import {MouseDropFieldRepository} from "./MouseDropRepository";

export class MouseDropFieldRepositoryImpl implements MouseDropFieldRepository {
    private static instance: MouseDropFieldRepositoryImpl | null = null;
    private yourFieldArea: THREE.Object3D;

    constructor() {
        this.yourFieldArea = this.createDummyYourFieldArea();
    }

    public static getInstance(): MouseDropFieldRepositoryImpl {
        if (!MouseDropFieldRepositoryImpl.instance) {
            MouseDropFieldRepositoryImpl.instance = new MouseDropFieldRepositoryImpl();
        }
        return MouseDropFieldRepositoryImpl.instance;
    }

    public isYourFieldAreaDropped(object: THREE.Object3D, raycaster: THREE.Raycaster): boolean {
        const intersects = raycaster.intersectObject(this.yourFieldArea);
        return intersects.length > 0;
    }

    private createDummyYourFieldArea(): THREE.Object3D {
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }
}
