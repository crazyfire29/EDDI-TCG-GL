import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyCardCloseButtonService} from './MyCardCloseButtonService';
import {MyCardCloseButton} from "../entity/MyCardCloseButton";
import {MyCardCloseButtonRepositoryImpl} from "../repository/MyCardCloseButtonRepositoryImpl";

export class MyCardCloseButtonServiceImpl implements MyCardCloseButtonService {
    private static instance: MyCardCloseButtonServiceImpl;
    private myCardCloseButtonRepository: MyCardCloseButtonRepositoryImpl;

    private constructor() {
        this.myCardCloseButtonRepository = MyCardCloseButtonRepositoryImpl.getInstance();
    }

    public static getInstance(): MyCardCloseButtonServiceImpl {
        if (!MyCardCloseButtonServiceImpl.instance) {
            MyCardCloseButtonServiceImpl.instance = new MyCardCloseButtonServiceImpl();
        }
        return MyCardCloseButtonServiceImpl.instance;
    }

    public async createCloseButton(type: number, position: Vector2d): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.myCardCloseButtonRepository.createCloseButton(type, position);
            const buttonMesh = button.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error creating My Card Close Button:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustCloseButtonPosition(): void {
        const buttonList = this.getAllCloseButton();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        buttonList.forEach((button) => {
            const buttonMesh = button.getMesh();
            const initialPosition = button.position;

            const buttonWidth = 0.032 * windowWidth;
            const buttonHeight = 0.06227 * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getCloseButtonById(id: number): MyCardCloseButton | null {
        return this.myCardCloseButtonRepository.findButtonById(id);
    }

    public deleteCloseButtonById(id: number): void {
        this.myCardCloseButtonRepository.deleteById(id);
    }

    public getAllCloseButton(): MyCardCloseButton[] {
        return this.myCardCloseButtonRepository.findAllButton();
    }

    public deleteAllCloseButtons(): void {
        this.myCardCloseButtonRepository.deleteAll();
    }

    public initializeCloseButtonVisibility(): void {
        const allButtonIds = this.myCardCloseButtonRepository.findAllButtonIds();
        allButtonIds.forEach((id) => this.myCardCloseButtonRepository.hideButton(id));
    }

}
