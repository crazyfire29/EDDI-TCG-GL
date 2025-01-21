import * as THREE from 'three';

export interface DeckMakePopupBackgroundService {
    createDeckMakePopupBackground(): Promise<THREE.Mesh | null>;
}