import * as THREE from 'three';
import {MyDeckCardSceneRepository} from "./MyDeckCardSceneRepository";
import {MyDeckCardScene} from "../entity/MyDeckCardScene";

export class MyDeckCardSceneRepositoryImpl implements MyDeckCardSceneRepository {
    private static instance: MyDeckCardSceneRepositoryImpl;
    private deckCardSceneMap: Map<number, MyDeckCardScene> = new Map();
    private deckToDeckCardSceneMap: Map<number, number> = new Map();

    private constructor() {}

    public static getInstance(): MyDeckCardSceneRepositoryImpl {
        if (!MyDeckCardSceneRepositoryImpl.instance) {
            MyDeckCardSceneRepositoryImpl.instance = new MyDeckCardSceneRepositoryImpl();
        }
        return MyDeckCardSceneRepositoryImpl.instance;
    }

    public save(deckId: number, cardIdList: number[], positionIdList: number[], meshes?: THREE.Group): MyDeckCardScene {
        const newDeckCardScene = new MyDeckCardScene(deckId, cardIdList, positionIdList, meshes);
        this.deckCardSceneMap.set(newDeckCardScene.id, newDeckCardScene);
        this.deckToDeckCardSceneMap.set(deckId, newDeckCardScene.id);

        return newDeckCardScene;
    }

     public addMeshToScene(deckId: number, mesh: THREE.Mesh): boolean {
         const scene = this.findCardSceneByDeckId(deckId);
         if (!scene) return false;
         scene.addMesh(mesh);
         return true;
     }

     public addMeshesToScene(deckId: number, cardGroup: THREE.Group): boolean {
         const scene = this.findCardSceneByDeckId(deckId);
         if (!scene) return false;
         scene.addMeshes(cardGroup);
         return true;
     }

     public removeMeshFromScene(deckId: number, mesh: THREE.Mesh): boolean {
         const scene = this.findCardSceneByDeckId(deckId);
         if (!scene) return false;
         return scene.removeMesh(mesh);
     }

     public getMeshesFromScene(deckId: number): THREE.Group | undefined {
         const scene = this.findCardSceneByDeckId(deckId);
         return scene ? scene.getMeshes() : undefined;
     }


    findById(sceneId: number): MyDeckCardScene | undefined {
        return this.deckCardSceneMap.get(sceneId);
    }

    findAll(): MyDeckCardScene[] {
        return Array.from(this.deckCardSceneMap.values());
    }

    deleteById(sceneId: number): boolean {
        const scene = this.findById(sceneId);
        if (!scene) return false;
        this.deckToDeckCardSceneMap.delete(scene.deckId);

        return this.deckCardSceneMap.delete(sceneId);
    }

    public findCardSceneByDeckId(deckId: number): MyDeckCardScene | null {
        const sceneId = this.deckToDeckCardSceneMap.get(deckId);
        if (sceneId === undefined) {
            return null;
        }
        return this.deckCardSceneMap.get(sceneId) || null;
    }

    public deleteButtonByDeckId(deckId: number): void {
        const sceneId = this.deckToDeckCardSceneMap.get(deckId);
        if (sceneId !== undefined) {
            this.deckCardSceneMap.delete(sceneId);
            this.deckToDeckCardSceneMap.delete(deckId);
        }
    }

    public deleteAll(): void {
        this.deckCardSceneMap.clear();
        this.deckToDeckCardSceneMap.clear();

    }

}
