import * as THREE from 'three';
import {DeckMakeButton} from "../entity/DeckMakeButton";

export interface DeckMakeButtonRepository {
    createDeckMakeButton(id: string): Promise<DeckMakeButton>;
    findButton(): DeckMakeButton | null;
    deleteButton(): void;
}