import {MyDeckButtonClickDetectService} from "./MyDeckButtonClickDetectService";
import {MyDeckButtonSceneRepositoryImpl} from "../../my_deck_button_scene/repository/MyDeckButtonSceneRepositoryImpl";
import {MyDeckButtonSceneRepository} from "../../my_deck_button_scene/repository/MyDeckButtonSceneRepository";
import {MyDeckButtonScene} from "../../my_deck_button_scene/entity/MyDeckButtonScene";

import {MyDeckButtonClickDetectRepositoryImpl} from "../repository/MyDeckButtonClickDetectRepositoryImpl";
import {MyDeckButtonClickDetectRepository} from "../repository/MyDeckButtonClickDetectRepository";
import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import * as THREE from "three";

export class MyDeckButtonClickDetectServiceImpl implements MyDeckButtonClickDetectService {
    private static instance: MyDeckButtonClickDetectServiceImpl | null = null;

    private myDeckButtonSceneRepository: MyDeckButtonSceneRepositoryImpl;
    private myDeckButtonClickDetectRepository: MyDeckButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository

    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myDeckButtonSceneRepository = MyDeckButtonSceneRepositoryImpl.getInstance();
        this.myDeckButtonClickDetectRepository = MyDeckButtonClickDetectRepositoryImpl.getInstance()
        this.cameraRepository = CameraRepositoryImpl.getInstance()
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyDeckButtonClickDetectServiceImpl {
        if (!MyDeckButtonClickDetectServiceImpl.instance) {
            MyDeckButtonClickDetectServiceImpl.instance = new MyDeckButtonClickDetectServiceImpl(camera, scene);
        }
        return MyDeckButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(
        event: MouseEvent,
        onClick: (clickedDeckButton: MyDeckButtonScene) => void
//         clickPoint: { x: number; y: number },
    ): Promise<MyDeckButtonScene | null> {
        const clickPoint = { x: event.clientX, y: event.clientY };
        const { x, y } = clickPoint;

        const deckSceneList = this.myDeckButtonSceneRepository.findAll()
        const clickedDeckButton = this.myDeckButtonClickDetectRepository.isMyDeckButtonClicked(
            { x, y },
            deckSceneList,
            this.camera
        );
        if (clickedDeckButton) {
            console.log(`Clicked Deck Button ID: ${clickedDeckButton.id}`);

            onClick(clickedDeckButton);

//             const buttonHide = this.myDeckButtonSceneRepository.hideById(clickedDeckButton.id);
//             if (buttonHide) {
//                 console.log(`Deck Button ID ${clickedDeckButton.id} is now hidden.`);
//             } else {
//                 console.error(`Failed to hide Deck Button ID ${clickedDeckButton.id}`);
//             }

            return clickedDeckButton;
        }

        return null;
    }
}
