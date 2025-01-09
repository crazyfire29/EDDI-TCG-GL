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

    public save(deckId: number, cardIdList: number[], positionIdList: number[]): MyDeckCardScene {
        const newDeckCardScene = new MyDeckCardScene(deckId, cardIdList, positionIdList);
        this.deckCardSceneMap.set(newDeckCardScene.id, newDeckCardScene);
        this.deckToDeckCardSceneMap.set(deckId, newDeckCardScene.id);

        return newDeckCardScene;
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
        const cardId = this.deckToDeckCardSceneMap.get(deckId);
        if (cardId === undefined) {
            return null;
        }
        return this.deckCardSceneMap.get(cardId) || null;
    }

    public deleteButtonByDeckId(deckId: number): void {
        const cardId = this.deckToDeckCardSceneMap.get(deckId);
        if (cardId !== undefined) {
            this.deckCardSceneMap.delete(cardId);
            this.deckToDeckCardSceneMap.delete(deckId);
        }
    }

    public deleteAll(): void {
        this.deckCardSceneMap.clear();
        this.deckToDeckCardSceneMap.clear();

    }

}
