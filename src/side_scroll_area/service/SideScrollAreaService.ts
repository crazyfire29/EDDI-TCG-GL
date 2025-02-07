import * as THREE from 'three';

export interface SideScrollAreaService {
    createSideScrollArea(): Promise<THREE.Mesh | null>;
}