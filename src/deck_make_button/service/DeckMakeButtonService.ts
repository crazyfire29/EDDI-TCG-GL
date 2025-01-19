import * as THREE from 'three';

export interface DeckMakeButtonService {
    createDeckMakeButton(): Promise<THREE.Mesh | null>;
}