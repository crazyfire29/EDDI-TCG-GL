import * as THREE from 'three';

export interface DeckMakePopupInputContainerService {
    createDeckMakePopupInputContainer(): Promise<HTMLDivElement | null>;
}