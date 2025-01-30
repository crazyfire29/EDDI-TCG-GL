import * as THREE from "three";

import {RaceButtonClickDetectService} from "./RaceButtonClickDetectService";
import {RaceButton} from "../../race_button/entity/RaceButton";
import {RaceButtonRepository} from "../../race_button/repository/RaceButtonRepository";
import {RaceButtonRepositoryImpl} from "../../race_button/repository/RaceButtonRepositoryImpl";

import {RaceButtonClickDetectRepository} from "../repository/RaceButtonClickDetectRepository";
import {RaceButtonClickDetectRepositoryImpl} from "../repository/RaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";


export class RaceButtonClickDetectServiceImpl implements RaceButtonClickDetectService {
    private static instance: RaceButtonClickDetectServiceImpl | null = null;

    private raceButtonRepository: RaceButtonRepositoryImpl;
    private raceButtonClickDetectRepository: RaceButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.raceButtonRepository = RaceButtonRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = RaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): RaceButtonClickDetectServiceImpl {
        if (!RaceButtonClickDetectServiceImpl.instance) {
            RaceButtonClickDetectServiceImpl.instance = new RaceButtonClickDetectServiceImpl(camera, scene);
        }
        return RaceButtonClickDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<RaceButton | null> {
        const { x, y } = clickPoint;
        const raceButtonList = this.getAllRaceButtons();
        const clickedRaceButton = this.raceButtonClickDetectRepository.isDeckRaceButtonClicked(
            { x, y },
            raceButtonList,
            this.camera
        );

        if (clickedRaceButton) {
            console.log(`[DEBUG] Clicked Race Button ID: ${clickedRaceButton.id}`);
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


    public async onMouseDown(event: MouseEvent): Promise<RaceButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(clickPoint);
        }
        return null;
    }

    public getAllRaceButtons(): RaceButton[] {
        return this.raceButtonRepository.findAll();
    }

    public saveCurrentClickedRaceButtonId(buttonId: number): void {
        this.raceButtonClickDetectRepository.saveCurrentClickedRaceButtonId(buttonId);
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

}
