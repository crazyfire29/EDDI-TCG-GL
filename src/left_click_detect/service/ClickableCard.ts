import * as THREE from 'three';

export interface ClickableCard {
    getId(): number;
    getMesh(): THREE.Mesh;
}