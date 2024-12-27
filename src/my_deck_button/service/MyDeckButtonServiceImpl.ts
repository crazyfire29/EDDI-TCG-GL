import * as THREE from 'three';
import { MyDeckButtonService } from './MyDeckButtonService';
import {MyDeckButtonType} from "../entity/MyDeckButtonType";
import {MyDeckButton} from "../entity/MyDeckButton";
import {MyDeckButtonRepository} from "../repository/MyDeckButtonRepository";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";
import {MyDeckButtonRepositoryImpl} from "../repository/MyDeckButtonRepositoryImpl";
import {MyDeckButtonPositionRepositoryImpl} from "../../my_deck_button_position/repository/MyDeckButtonPositionRepositoryImpl";
import {MyDeckButtonSceneRepositoryImpl} from "../../my_deck_button_scene/repository/MyDeckButtonSceneRepositoryImpl";
import {MyDeckButtonScene} from "../../my_deck_button_scene/entity/MyDeckButtonScene";
import { MyDeckButtonPosition } from "../../my_deck_button_position/entity/MyDeckButtonPosition";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonServiceImpl implements MyDeckButtonService {
    private static instance: MyDeckButtonServiceImpl;
    private myDeckButtonRepository: MyDeckButtonRepository;
    private myDeckButtonSceneRepository: MyDeckButtonSceneRepositoryImpl;
    private myDeckButtonPositionRepository: MyDeckButtonPositionRepositoryImpl;

    private constructor(myDeckButtonRepository: MyDeckButtonRepository) {
        this.myDeckButtonRepository = myDeckButtonRepository;
        this.myDeckButtonSceneRepository = MyDeckButtonSceneRepositoryImpl.getInstance();
        this.myDeckButtonPositionRepository = MyDeckButtonPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): MyDeckButtonServiceImpl {
        if (!MyDeckButtonServiceImpl.instance) {
            const myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
            MyDeckButtonServiceImpl.instance = new MyDeckButtonServiceImpl(myDeckButtonRepository);
        }
        return MyDeckButtonServiceImpl.instance;
    }

    public async createMyDeckButtonWithPosition(deckId: number): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const position = this.myDeckButtonPosition(deckId);
            console.log(`Deck ${deckId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);
            this.saveMyDeckButtonPosition(deckId, position);

            const deckButtonScene = await this.createDeckButtonScene(deckId, position.position);
            const buttonMesh = deckButtonScene.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error creating my deck button with position:', error);
            return null;
        }
        return buttonGroup;
    }

    private async createDeckButtonScene(deckId: number, position: Vector2d): Promise<MyDeckButtonScene> {
        return await this.myDeckButtonSceneRepository.createMyDeckButtonScene(deckId, position);
    }

    private myDeckButtonPosition(deckId: number): MyDeckButtonPosition {
        return this.myDeckButtonPositionRepository.addMyDeckButtonPosition(deckId);
    }

    private saveMyDeckButtonPosition(deckId: number, position: MyDeckButtonPosition): void {
        this.myDeckButtonPositionRepository.save(deckId, position);
    }

    public adjustMyDeckButtonPosition(): void {
        const positionRepository = MyDeckButtonPositionRepositoryImpl.getInstance();
        const sceneRepository = MyDeckButtonSceneRepositoryImpl.getInstance();

        const buttonList = sceneRepository.findAll();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const buttonPosition = positionRepository.findAll();

        console.log('buttonList:', buttonList);
        console.log('buttonPosition:', buttonPosition);

        for (const button of buttonList) {
            console.log(`Button ID: ${button.id}`);
            const buttonMesh = button.getMesh();
            const buttonId = button.id;
            const initialPosition = positionRepository.findById(buttonId);
            console.log(`InitialPosition: ${initialPosition}`);

            if (!initialPosition) {
                console.error(`No position found for button id: ${buttonId}`);
                continue;
            }

            const buttonWidth = (350 / 1920) * window.innerWidth;
            const buttonHeight = (90 / 1080) * window.innerHeight;

            const newPositionX = initialPosition.position.getX() * window.innerWidth;
            const newPositionY = initialPosition.position.getY() * window.innerHeight;
            console.log(`Button ${buttonId}:`, {
                initialPosition: initialPosition.position,
                newPositionX,
                newPositionY,
            });

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        }

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

    public hideMyDeckButtonById(id: number): void{
        this.myDeckButtonRepository.hideById(id);
    }
}
