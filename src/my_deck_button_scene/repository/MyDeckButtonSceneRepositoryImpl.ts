import {MyDeckButtonScene} from "../entity/MyDeckButtonScene";
import {MyDeckButtonSceneRepository} from "./MyDeckButtonSceneRepository";
import {MeshGenerator} from "../../mesh/generator";
import {MyDeckButtonRepositoryImpl} from "../../my_deck_button/repository/MyDeckButtonRepositoryImpl"

import {TextureManager} from "../../texture_manager/TextureManager";
import {Vector2d} from "../../common/math/Vector2d";
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckButtonSceneRepositoryImpl implements MyDeckButtonSceneRepository {
    private static instance: MyDeckButtonSceneRepositoryImpl;

    private myDeckButtonSceneMap: Map<number, MyDeckButtonScene> = new Map();
    private myDeckButtonRepositoryImpl = MyDeckButtonRepositoryImpl.getInstance();

    private constructor() {}

    public static getInstance(): MyDeckButtonSceneRepositoryImpl {
        if (!MyDeckButtonSceneRepositoryImpl.instance) {
            MyDeckButtonSceneRepositoryImpl.instance = new MyDeckButtonSceneRepositoryImpl();
        }
        return MyDeckButtonSceneRepositoryImpl.instance;
    }

    // To-do: 사용자가 버튼을 클릭했을 때 나타나는 네온 버튼 별도 관리 필요
    async createMyDeckButtonScene(deckId: number, position: Vector2d): Promise<MyDeckButtonScene> {
        const buttonMesh = await this.myDeckButtonRepositoryImpl.createMyDeckButton(2, position);
        const newButtonScene = new MyDeckButtonScene(buttonMesh.mesh);
        newButtonScene.id = deckId;
        this.myDeckButtonSceneMap.set(newButtonScene.id, newButtonScene);

        return newButtonScene;
    }

    findById(id: number): MyDeckButtonScene | undefined {
        return this.myDeckButtonSceneMap.get(id);
    }

    findAll(): MyDeckButtonScene[] {
        return Array.from(this.myDeckButtonSceneMap.values());
    }

    deleteById(id: number): boolean {
        return this.myDeckButtonSceneMap.delete(id);
    }

    deleteAll(): void {
        this.myDeckButtonSceneMap.clear();
    }
}