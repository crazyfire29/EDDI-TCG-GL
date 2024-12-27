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
    private myDeckNeonButtonSceneMap: Map<number, MyDeckButtonScene> = new Map();
    private myDeckButtonRepositoryImpl = MyDeckButtonRepositoryImpl.getInstance();

    private constructor() {}

    public static getInstance(): MyDeckButtonSceneRepositoryImpl {
        if (!MyDeckButtonSceneRepositoryImpl.instance) {
            MyDeckButtonSceneRepositoryImpl.instance = new MyDeckButtonSceneRepositoryImpl();
        }
        return MyDeckButtonSceneRepositoryImpl.instance;
    }

    async createMyDeckButtonScene(deckId: number, position: Vector2d): Promise<MyDeckButtonScene> {
        const buttonMesh = await this.myDeckButtonRepositoryImpl.createMyDeckButton(2, position);
        const newButtonScene = new MyDeckButtonScene(buttonMesh.mesh);

        console.log(`Generated ID for deckId ${deckId}:`, newButtonScene.id);

        this.myDeckButtonSceneMap.set(deckId, newButtonScene);

        return newButtonScene;
    }

//     async createMyDeckNeonButtonScene(deckId: number, position: Vector2d): Promise<MyDeckButtonScene> {
//         const buttonMesh = await this.myDeckButtonRepositoryImpl.createMyDeckButton(1, position);
//         const newButtonScene = new MyDeckButtonScene(buttonMesh.mesh);
//         this.myDeckNeonButtonSceneMap.set(deckId, newButtonScene);
//
//         return newButtonScene;
//     }


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

    hideById(id: number): boolean {
        const buttonScene = this.findById(id);
        if (buttonScene) {
            buttonScene.getMesh().visible = false;
            return true;
        }
        return false;
    }

    showById(id: number): boolean {
        const buttonScene = this.findById(id);
        if (buttonScene) {
            buttonScene.getMesh().visible = true;
            return true;
        }
        return false;
    }

//     findNeonButtonById(id: number): MyDeckButtonScene | undefined {
//         return this.myDeckNeonButtonSceneMap.get(id);
//     }
//
//     findNeonButtonAll(): MyDeckButtonScene[] {
//         return Array.from(this.myDeckNeonButtonSceneMap.values());
//     }
//
//     hideNeonButtonById(id: number): boolean {
//         const neonButtonScene = this.findNeonButtonById(id);
//         if (neonButtonScene) {
//             neonButtonScene.getMesh().visible = false;
//             return true;
//         }
//         return false;
//     }
//
//     showNeonButtonById(id: number): boolean {
//         const neonButtonScene = this.findNeonButtonById(id);
//         if (neonButtonScene) {
//             neonButtonScene.getMesh().visible = true;
//             return true;
//         }
//         return false;
//     }

}