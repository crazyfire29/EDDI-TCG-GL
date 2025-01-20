import * as THREE from 'three';

export interface TransparentBackgroundService {
    createTransparentBackground(): Promise<THREE.Mesh | null>;
}