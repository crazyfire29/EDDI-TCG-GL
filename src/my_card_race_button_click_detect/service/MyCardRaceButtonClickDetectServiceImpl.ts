import * as THREE from "three";

import {MyCardRaceButtonClickDetectService} from "./MyCardRaceButtonClickDetectService";
import {MyCardRaceButton} from "../../my_card_race_button/entity/MyCardRaceButton";
import {MyCardRaceButtonRepositoryImpl} from "../../my_card_race_button/repository/MyCardRaceButtonRepositoryImpl"
import {MyCardRaceButtonClickDetectRepositoryImpl} from "../repository/MyCardRaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class MyCardRaceButtonClickDetectServiceImpl implements MyCardRaceButtonClickDetectService {
    private static instance: MyCardRaceButtonClickDetectServiceImpl | null = null;
    private raceButtonRepository: MyCardRaceButtonRepositoryImpl;
    private raceButtonClickDetectRepository: MyCardRaceButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.raceButtonRepository = MyCardRaceButtonRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = MyCardRaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyCardRaceButtonClickDetectServiceImpl {
        if (!MyCardRaceButtonClickDetectServiceImpl.instance) {
            MyCardRaceButtonClickDetectServiceImpl.instance = new MyCardRaceButtonClickDetectServiceImpl(camera, scene);
        }
        return MyCardRaceButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleRaceButtonClick(clickPoint: { x: number; y: number }): Promise<MyCardRaceButton | null> {
        const { x, y } = clickPoint;
        const raceButtonList = this.getAllRaceButtons();
        const clickedRaceButton = this.raceButtonClickDetectRepository.isRaceButtonClicked(
            { x, y },
            raceButtonList,
            this.camera
        );

        if (clickedRaceButton) {
            console.log(`[DEBUG] Clicked Race Button ID: ${clickedRaceButton.id}`); // raceButtonList 기준으로 0, 1, 2임.
            this.saveCurrentClickedRaceButtonId(clickedRaceButton.id);
            const currentClickedButtonId = this.getCurrentClickedRaceButtonId();

            switch(currentClickedButtonId) {
                case 0:
                    console.log(`Clicked Human Button!: ${currentClickedButtonId}`);
                    break;
                case 1:
                    console.log(`Clicked Undead Button!: ${currentClickedButtonId}`);
                    break;
                case 2:
                    console.log(`Clicked Trent Button! ${currentClickedButtonId}`);
                    break;
                default:
                    console.warn(`[WARN] Not Found Race Button Id: ${currentClickedButtonId}`);
            }

            return clickedRaceButton;
        }

        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<MyCardRaceButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleRaceButtonClick(clickPoint);
        }
        return null;
    }

    public getAllRaceButtons(): MyCardRaceButton[] {
        return this.raceButtonRepository.findAllButton();
    }

    public saveCurrentClickedRaceButtonId(buttonId: number): void {
        this.raceButtonClickDetectRepository.saveCurrentClickedRaceButtonId(buttonId);
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

}
