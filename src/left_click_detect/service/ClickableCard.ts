import * as THREE from 'three';

export interface ClickableCard {
    getId(): number;
    getCardSceneId(): number;
    getMesh(): THREE.Mesh;
}