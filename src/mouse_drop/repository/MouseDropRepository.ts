import * as THREE from 'three';

export interface MouseDropFieldRepository {
    isYourFieldAreaDropped(object: THREE.Object3D, raycaster: THREE.Raycaster): boolean;
}