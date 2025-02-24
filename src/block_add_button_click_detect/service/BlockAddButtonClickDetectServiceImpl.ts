import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {BlockAddButtonClickDetectService} from "./BlockAddButtonClickDetectService";
import {BlockAddButtonClickDetectRepositoryImpl} from "../repository/BlockAddButtonClickDetectRepositoryImpl";
import {BlockAddButton} from "../../block_add_button/entity/BlockAddButton";
import {BlockAddButtonRepositoryImpl} from "../../block_add_button/repository/BlockAddButtonRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";


export class BlockAddButtonClickDetectServiceImpl implements BlockAddButtonClickDetectService {
    private static instance: BlockAddButtonClickDetectServiceImpl | null = null;
    private blockAddButtonClickDetectRepository: BlockAddButtonClickDetectRepositoryImpl;
    private blockAddButtonRepository: BlockAddButtonRepositoryImpl;
    private cameraRepository: CameraRepository;

    private mouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.blockAddButtonClickDetectRepository = BlockAddButtonClickDetectRepositoryImpl.getInstance();
        this.blockAddButtonRepository = BlockAddButtonRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): BlockAddButtonClickDetectServiceImpl {
        if (!BlockAddButtonClickDetectServiceImpl.instance) {
            BlockAddButtonClickDetectServiceImpl.instance = new BlockAddButtonClickDetectServiceImpl(camera, scene);
        }
        return BlockAddButtonClickDetectServiceImpl.instance;
    }

    setMouseDown(state: boolean): void {
        this.mouseDown = state;
    }

    isMouseDown(): boolean {
        return this.mouseDown;
    }

    public async handleButtonClick(clickPoint: { x: number; y: number }): Promise<BlockAddButton | null> {
        const { x, y } = clickPoint;
        const buttonList = this.getAllButtons();
        const clickedButton = this.blockAddButtonClickDetectRepository.isButtonClicked(
            { x, y },
            buttonList,
            this.camera
        );

        if (clickedButton) {
            const buttonId = clickedButton.id;
            const cardId = this.getCardIdByButtonUniqueId(buttonId);
            console.log(`[DEBUG] Clicked Button ID: ${buttonId}, Card ID: ${cardId}`);
            this.saveCurrentClickedButtonId(cardId);

            return clickedButton;
        }
        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<BlockAddButton | null> {
        if (event.button === 0) {
            const clickPoint = { x: event.clientX, y: event.clientY };
            return await this.handleButtonClick(clickPoint);
        }
        return null;
    }

    public getAllButtons(): BlockAddButton[] {
        return this.blockAddButtonRepository.findAllButtons();
    }

    public getCardIdByButtonUniqueId(buttonUniqueId: number): number {
        return this.blockAddButtonRepository.findCardIdByButtonId(buttonUniqueId) ?? -1;
    }

    public saveCurrentClickedButtonId(cardId: number): void {
        this.blockAddButtonClickDetectRepository.saveCurrentClickedButtonId(cardId);
    }

    public getCurrentClickedButtonId(): number | null {
        return this.blockAddButtonClickDetectRepository.findCurrentClickedButtonId();
    }

    private getButtonCardIdList(): number[] {
        return this.blockAddButtonRepository.findCardIdList();
    }

}
