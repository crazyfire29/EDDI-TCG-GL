import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {MakeDeckScreenDoneButtonService} from './MakeDeckScreenDoneButtonService';
import {MakeDeckScreenDoneButtonType} from "../entity/MakeDeckScreenDoneButtonType";
import {MakeDeckScreenDoneButton} from "../entity/MakeDeckScreenDoneButton";
import {MakeDeckScreenDoneButtonRepositoryImpl} from "../repository/MakeDeckScreenDoneButtonRepositoryImpl";

export class MakeDeckScreenDoneButtonServiceImpl implements MakeDeckScreenDoneButtonService {
    private static instance: MakeDeckScreenDoneButtonServiceImpl;
    private makeDeckScreenDoneButtonRepository: MakeDeckScreenDoneButtonRepositoryImpl;

    private constructor() {
        this.makeDeckScreenDoneButtonRepository = MakeDeckScreenDoneButtonRepositoryImpl.getInstance();
    }

    public static getInstance(): MakeDeckScreenDoneButtonServiceImpl {
        if (!MakeDeckScreenDoneButtonServiceImpl.instance) {
            MakeDeckScreenDoneButtonServiceImpl.instance = new MakeDeckScreenDoneButtonServiceImpl();
        }
        return MakeDeckScreenDoneButtonServiceImpl.instance;
    }

    public async createDoneButton(
        type: MakeDeckScreenDoneButtonType,
        position: Vector2d
    ): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.makeDeckScreenDoneButtonRepository.createDoneButton(type, position);
            const buttonMesh = button.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error Creating Done Button:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustDoneButtonPosition(): void {
        const buttonList = this.getAllDoneButtons();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        buttonList.forEach((button) => {
            const buttonMesh = button.getMesh();
            const initialPosition = button.position;

            const buttonWidth = (450 / 1920) * windowWidth;
            const buttonHeight = (140 / 1080) * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getDoneButtonById(id: number): MakeDeckScreenDoneButton | null {
        return this.makeDeckScreenDoneButtonRepository.findById(id);
    }

    public deleteDoneButtonById(id: number): void {
        this.makeDeckScreenDoneButtonRepository.deleteById(id);
    }

    public getAllDoneButtons(): MakeDeckScreenDoneButton[] {
        return this.makeDeckScreenDoneButtonRepository.findAll();
    }

    public deleteAllDoneButtons(): void {
        this.makeDeckScreenDoneButtonRepository.deleteAll();
    }

    public initializeDoneButtonVisible(): void {
        this.makeDeckScreenDoneButtonRepository.hideButton(1);
    }

}
