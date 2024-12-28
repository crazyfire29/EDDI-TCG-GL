import {DeckPageMovementButtonClickDetectService} from "./DeckPageMoveButtonClickDetectService";

import {MyDeckButtonPageMovementButtonRepositoryImpl} from "../../my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepositoryImpl";
import {MyDeckButtonPageMovementButtonRepository} from "../../my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepository";
import {MyDeckButtonPageMovementButton} from "../../my_deck_button_page_movement_button/entity/MyDeckButtonPageMovementButton";

import {DeckPageMovementButtonClickDetectRepositoryImpl} from "../repository/DeckPageMoveButtonClickDetectRepositoryImpl";
import {DeckPageMovementButtonClickDetectRepository} from "../repository/DeckPageMoveButtonClickDetectRepository";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import * as THREE from "three";

export class DeckPageMovementButtonClickDetectServiceImpl implements DeckPageMovementButtonClickDetectService {
    private static instance: DeckPageMovementButtonClickDetectServiceImpl | null = null;

    private myDeckButtonPageMovementButtonRepository: MyDeckButtonPageMovementButtonRepositoryImpl;
    private deckPageMoveButtonClickDetectRepository: DeckPageMovementButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonPageMovementButtonRepository = MyDeckButtonPageMovementButtonRepositoryImpl.getInstance();
        this.deckPageMoveButtonClickDetectRepository = DeckPageMovementButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): DeckPageMovementButtonClickDetectServiceImpl {
        if (!DeckPageMovementButtonClickDetectServiceImpl.instance) {
            DeckPageMovementButtonClickDetectServiceImpl.instance = new DeckPageMovementButtonClickDetectServiceImpl(camera, scene);
        }
        return DeckPageMovementButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(
        clickPoint: { x: number; y: number },
    ): Promise<MyDeckButtonPageMovementButton | null> {
        const { x, y } = clickPoint;

        const deckPageMoveButtonList = this.myDeckButtonPageMovementButtonRepository.findAll()
        const clickedDeckPageMovementButton = this.deckPageMoveButtonClickDetectRepository.isDeckMoveButtonClicked(
            { x, y },
            deckPageMoveButtonList,
            this.camera
        );
        if (clickedDeckPageMovementButton) {
            console.log(`Clicked Deck Page Movement Button ID: ${clickedDeckPageMovementButton.id}`);

            return clickedDeckPageMovementButton;
        }

        return null;
    }

}
