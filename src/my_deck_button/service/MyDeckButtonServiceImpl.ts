import * as THREE from 'three';
import { MyDeckButtonService } from './MyDeckButtonService';
import {MyDeckButtonType} from "../entity/MyDeckButtonType";
import {MyDeckButton} from "../entity/MyDeckButton";
import {MyDeckButtonRepository} from "../repository/MyDeckButtonRepository";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";
import {MyDeckButtonRepositoryImpl} from "../repository/MyDeckButtonRepositoryImpl";
import {MyDeckButtonPositionRepositoryImpl} from "../../my_deck_button_position/repository/MyDeckButtonPositionRepositoryImpl";
import {MyDeckButtonEffectRepositoryImpl} from "../../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";
import {MyDeckButtonEffect} from "../../my_deck_button_effect/entity/MyDeckButtonEffect";
import {MyDeckButtonPosition} from "../../my_deck_button_position/entity/MyDeckButtonPosition";
import {Vector2d} from "../../common/math/Vector2d";
import {ButtonStateManager} from "../../my_deck_button_manager/ButtonStateManager";
import {ButtonEffectManager} from "../../my_deck_button_manager/ButtonEffectManager";

export class MyDeckButtonServiceImpl implements MyDeckButtonService {
    private static instance: MyDeckButtonServiceImpl;
    private myDeckButtonRepository: MyDeckButtonRepositoryImpl;
    private myDeckButtonPositionRepository: MyDeckButtonPositionRepositoryImpl;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;
    private buttonStateManager: ButtonStateManager;
    private buttonEffectManger: ButtonEffectManager;

    private constructor(myDeckButtonRepository: MyDeckButtonRepository) {
        this.myDeckButtonRepository = MyDeckButtonRepositoryImpl.getInstance();
        this.myDeckButtonPositionRepository = MyDeckButtonPositionRepositoryImpl.getInstance();
        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();
        this.buttonStateManager = new ButtonStateManager();
        this.buttonEffectManger = new ButtonEffectManager();
    }

    public static getInstance(): MyDeckButtonServiceImpl {
        if (!MyDeckButtonServiceImpl.instance) {
            const repository = MyDeckButtonRepositoryImpl.getInstance();
            MyDeckButtonServiceImpl.instance = new MyDeckButtonServiceImpl(repository);
        }
        return MyDeckButtonServiceImpl.instance;
    }

    public async createMyDeckButtonWithPosition(deckId: number): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const position = this.myDeckButtonPosition(deckId);
            console.log(`Deck ${deckId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);
            this.saveMyDeckButtonPosition(deckId, position);

            const deckButton = await this.createMyDeckButton(deckId, position.position);
            buttonGroup.add(deckButton.mesh);

        } catch (error) {
            console.error('Error creating my deck button with position:', error);
            return null;
        }
        return buttonGroup;
    }

    public async createDeckButtonEffectWithPosition(deckId: number): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const position = this.findMyDeckButtonPosition(deckId);

            if (!position) {
                console.error(`Position not found for deckId: ${deckId}`);
                return null;
            }

            const deckButtonEffect = await this.createMyDeckButtonEffect(deckId, position.position);
            buttonGroup.add(deckButtonEffect.mesh);

        } catch (error) {
            console.log('Error creating button effect with position:', error);
            return null;
        }
        return buttonGroup;
    }

    private async createMyDeckButton(deckId: number, position: Vector2d): Promise<MyDeckButton> {
        return await this.myDeckButtonRepository.createMyDeckButton(deckId, position);
    }

    private myDeckButtonPosition(deckId: number): MyDeckButtonPosition {
        return this.myDeckButtonPositionRepository.addMyDeckButtonPosition(deckId);
    }

    private saveMyDeckButtonPosition(deckId: number, position: MyDeckButtonPosition): void {
        this.myDeckButtonPositionRepository.save(deckId, position);
    }

    private findMyDeckButtonPosition(deckId: number): MyDeckButtonPosition | undefined{
        return this.myDeckButtonPositionRepository.findById(deckId);
    }

    private async createMyDeckButtonEffect(deckId: number, position: Vector2d): Promise<MyDeckButtonEffect>{
        return await this.myDeckButtonEffectRepository.createMyDeckButtonEffect(deckId, position);
    }

    public adjustMyDeckButtonPosition(): void {
        const positionRepository = this.myDeckButtonPositionRepository
        const buttonRepository = this.myDeckButtonRepository

        const buttonList = buttonRepository.findAll();
        const buttonPosition = positionRepository.findAll();

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

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

    public adjustMyDeckButtonEffectPosition(): void {
        const positionRepository = this.myDeckButtonPositionRepository
        const buttonEffectRepository = this.myDeckButtonEffectRepository

        const buttonEffectList = buttonEffectRepository.findAll();
        const buttonPosition = positionRepository.findAll();

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        console.log('buttonEffectList:', buttonEffectList);
        console.log('buttonPosition:', buttonPosition);

        for (const buttonEffect of buttonEffectList) {
            const buttonEffectMesh = buttonEffect.getMesh();
            const buttonEffectId = buttonEffect.id;
            const initialPosition = positionRepository.findById(buttonEffectId);

            if (!initialPosition) {
                console.error(`No position found for button id: ${buttonEffectId}`);
                continue;
            }

            const buttonWidth = (350 / 1920) * window.innerWidth;
            const buttonHeight = (90 / 1080) * window.innerHeight;

            const newPositionX = initialPosition.position.getX() * window.innerWidth;
            const newPositionY = initialPosition.position.getY() * window.innerHeight;
            console.log(`Button ${buttonEffectId}:`, {
                initialPosition: initialPosition.position,
                newPositionX,
                newPositionY,
            });

            buttonEffectMesh.geometry.dispose();
            buttonEffectMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonEffectMesh.position.set(newPositionX, newPositionY, 0);
        }

    }

    public setVisibleDeckButton(buttonId: number, isVisible: boolean): void {
       // ButtonStateManager를 사용하여 버튼의 visibility 상태 설정
       this.buttonStateManager.setVisibility(buttonId, isVisible);

       // 버튼을 보이게 하거나 숨김
       const button = this.getMyDeckButtonById(buttonId); // 버튼 찾기
       if (button) {
           button.getMesh().visible = isVisible;
       }
    }

   public setVisibleDeckButtonEffect(buttonId: number, isVisible: boolean): void {
       this.buttonEffectManger.setVisibility(buttonId, isVisible);

       const button = this.getMyDeckButtonEffectById(buttonId);
       if (button) {
           button.getMesh().visible = isVisible;
       }
   }


    public getMyDeckButtonById(id: number): MyDeckButton | null {
        return this.myDeckButtonRepository.findById(id);
    }

    public getMyDeckButtonEffectById(id: number): MyDeckButtonEffect | null {
        return this.myDeckButtonEffectRepository.findById(id);
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

    public getAllMyDeckButtonById(): Map<number, MyDeckButton> {
        return this.myDeckButtonRepository.getAllMyDeckButtons();
    }

}
