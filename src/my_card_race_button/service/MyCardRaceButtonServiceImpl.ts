import * as THREE from 'three';
import {MyCardRaceButtonService} from './MyCardRaceButtonService';
import {MyCardRaceButton} from "../entity/MyCardRaceButton";
import {MyCardRaceButtonRepositoryImpl} from "../repository/MyCardRaceButtonRepositoryImpl";
import {CardRace} from "../../card/race";
import {Vector2d} from "../../common/math/Vector2d";
import {MyCardRaceButtonStateManager} from "../../my_card_race_button_manager/MyCardRaceButtonStateManager";

export class MyCardRaceButtonServiceImpl implements MyCardRaceButtonService {
    private static instance: MyCardRaceButtonServiceImpl;
    private myCardRaceButtonRepository: MyCardRaceButtonRepositoryImpl;
    private raceButtonStateManager: MyCardRaceButtonStateManager;

    private constructor() {
        this.myCardRaceButtonRepository = MyCardRaceButtonRepositoryImpl.getInstance();
        this.raceButtonStateManager = MyCardRaceButtonStateManager.getInstance();
    }

    public static getInstance(): MyCardRaceButtonServiceImpl {
        if (!MyCardRaceButtonServiceImpl.instance) {
            MyCardRaceButtonServiceImpl.instance = new MyCardRaceButtonServiceImpl();
        }
        return MyCardRaceButtonServiceImpl.instance;
    }

    public async createRaceButton(type: CardRace, position: Vector2d): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.myCardRaceButtonRepository.createRaceButton(type, position);
            const buttonMesh = button.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error creating My Card Race Button:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustRaceButtonPosition(): void {
        const buttonList = this.getAllRaceButton();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        buttonList.forEach((button) => {
            const buttonMesh = button.getMesh();
            const initialPosition = button.position;

            const buttonWidth = 0.068 * windowWidth;
            const buttonHeight = 0.131 * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getRaceButtonById(id: number): MyCardRaceButton | null {
        return this.myCardRaceButtonRepository.findButtonById(id);
    }

    public deleteRaceButtonById(id: number): void {
        this.myCardRaceButtonRepository.deleteById(id);
    }

    public getAllRaceButton(): MyCardRaceButton[] {
        return this.myCardRaceButtonRepository.findAllButton();
    }

    public deleteAllRaceButtons(): void {
        this.myCardRaceButtonRepository.deleteAll();
    }

    public initializeRaceButtonVisible(): void {
        this.raceButtonStateManager.setVisibility(0, false);
        this.raceButtonStateManager.setVisibility(1, true);
        this.raceButtonStateManager.setVisibility(2, true);
    }

}
