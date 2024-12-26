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
                positionRepository.save(position);
                const deckButtonScene = await sceneRepository.createMyDeckButtonScene(position.position);

                const buttonMesh = deckButtonScene.getMesh();
                buttonGroup.add(buttonMesh);
            }

        } catch (error) {
            console.error('Error creating my deck button with position:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustMyDeckButtonPosition(): void {
        const positionRepository = MyDeckButtonPositionRepositoryImpl.getInstance();
        const sceneRepository = MyDeckButtonSceneRepositoryImpl.getInstance();

        const buttonList = sceneRepository.findAll();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const buttonPositionMap = new Map(
            positionRepository.findAll().map((position) => [position.id, position.position])
        );
        console.log('buttonList:', buttonList);
        console.log('buttonPositionMap:', buttonPositionMap);

        for (let i = 0; i < buttonList.length; i++) {
            const button = buttonList[i];
            const buttonMesh = button.getMesh();
            const buttonId = button.id;

            console.log(`buttonId?: ${buttonId}`);
            const initialPosition = buttonPositionMap.get(buttonId);

            if (!initialPosition) {
                console.error(`No position found for button id: ${buttonId}`);
                continue;
            }

            const buttonWidth = (350 / 1920) * window.innerWidth;
            const buttonHeight = (90 / 1080) * window.innerHeight;

            const newPositionX = initialPosition.getX() * window.innerWidth;
            const newPositionY = initialPosition.getY() * window.innerHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        }

//         buttonList.forEach((button) =>{
//             const buttonMesh = button.getMesh();
//             const buttonId = button.id;
//             console.log(`buttonId?: ${buttonId}`);
//             const initialPosition = buttonPositionMap.get(buttonId);
//
//             if (!initialPosition) {
//                 console.error(`No position found for button id: ${buttonId}`);
//                 return;
//             }
//
//             const buttonWidth = (350 / 1920) * windowWidth;
//             const buttonHeight = (90 / 1080) * windowHeight;
//
//             const newPositionX = initialPosition.getX() * windowWidth;
//             const newPositionY = initialPosition.getY() * windowHeight;
//
//             buttonMesh.geometry.dispose();
//             buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);
//
//             buttonMesh.position.set(newPositionX, newPositionY, 0);
//         });

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
