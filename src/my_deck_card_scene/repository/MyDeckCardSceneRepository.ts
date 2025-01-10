import * as THREE from 'three';
import {MyDeckCardScene} from "../entity/MyDeckCardScene";

export interface MyDeckCardSceneRepository {
    save(deckId: number, cardIdList: number[], positionIdList: number[]): MyDeckCardScene;
    findById(sceneId: number): MyDeckCardScene | undefined;
    findAll(): MyDeckCardScene[];
    deleteById(sceneId: number): boolean;
    deleteAll(): void;

    findCardSceneByDeckId(deckId: number): MyDeckCardScene | null;
    deleteButtonByDeckId(deckId: number): void;

    addMeshToScene(deckId: number, mesh: THREE.Mesh): boolean;
    addMeshesToScene(deckId: number, cardGroup: THREE.Group): boolean;
    removeMeshFromScene(deckId: number, mesh: THREE.Mesh): boolean;
    getMeshesFromScene(deckId: number): THREE.Group | undefined;
}