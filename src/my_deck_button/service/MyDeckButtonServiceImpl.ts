import * as THREE from 'three';
import { MyDeckButtonService } from './MyDeckButtonService';
import {MyDeckButtonType} from "../entity/MyDeckButtonType";
import {MyDeckButton} from "../entity/MyDeckButton";
import {MyDeckButtonRepository} from "../repository/MyDeckButtonRepository";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";
import {MyDeckButtonRepositoryImpl} from "../repository/MyDeckButtonRepositoryImpl";
import {MyDeckButtonPositionRepositoryImpl} from "../../my_deck_button_position/repository/MyDeckButtonPositionRepositoryImpl";
import {MyDeckButtonSceneRepositoryImpl} from "../../my_deck_button_scene/repository/MyDeckButtonSceneRepositoryImpl";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonServiceImpl implements MyDeckButtonService {
    private static instance: MyDeckButtonServiceImpl;
    private myDeckButtonRepository: MyDeckButtonRepository;

    private constructor(myDeckButtonRepository: MyDeckButtonRepository) {
        this.myDeckButtonRepository = myDeckButtonRepository;
    }

    public static getInstance(): MyDeckButtonServiceImpl {
        if (!MyDeckButtonServiceImpl.instance) {
            const myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
            MyDeckButtonServiceImpl.instance = new MyDeckButtonServiceImpl(myDeckButtonRepository);
        }
        return MyDeckButtonServiceImpl.instance;
    }

    public async createMyDeckButtonWithPosition(deckCount: number): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const positionRepository = MyDeckButtonPositionRepositoryImpl.getInstance();
            const sceneRepository = MyDeckButtonSceneRepositoryImpl.getInstance();

            for (let i = 1; i <= deckCount; i++) {
                const position = positionRepository.addMyDeckButtonPosition(i);
                const deckButtonScene = await sceneRepository.createMyDeckButtonScene(i, position);

                const buttonMesh = deckButtonScene.getMesh();
                buttonGroup.add(buttonMesh);
            }

        } catch (error) {
            console.error('Error creating my deck button with position:', error);
            return null;
        }
        return buttonGroup;
    }


    public getMyDeckButtonById(id: number): MyDeckButton | null {
        return this.myDeckButtonRepository.findById(id);
    }

    public deleteMyDeckButtonById(id: number): void {
        this.myDeckButtonRepository.deleteById(id);
    }

    public getAllMyDeckButton(): MyDeckButton[] {
        return this.myDeckButtonRepository.findAll();
    }

    public deleteAllMyDeckButton(): void {
        this.myDeckButtonRepository.deleteAll();
    }
}
