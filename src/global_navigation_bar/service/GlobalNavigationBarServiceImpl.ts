import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {GlobalNavigationBarService} from './GlobalNavigationBarService';
import {GlobalNavigationBar} from "../entity/GlobalNavigationBar";
import {GlobalNavigationBarRepositoryImpl} from "../repository/GlobalNavigationBarRepositoryImpl";

export class GlobalNavigationBarServiceImpl implements GlobalNavigationBarService {
    private static instance: GlobalNavigationBarServiceImpl;
    private globalNavigationBarRepository: GlobalNavigationBarRepositoryImpl;

    private constructor() {
        this.globalNavigationBarRepository = GlobalNavigationBarRepositoryImpl.getInstance();
    }

    public static getInstance(): GlobalNavigationBarServiceImpl {
        if (!GlobalNavigationBarServiceImpl.instance) {
            GlobalNavigationBarServiceImpl.instance = new GlobalNavigationBarServiceImpl();
        }
        return GlobalNavigationBarServiceImpl.instance;
    }

    public async createGlobalNavigationBar(type: number, position: Vector2d): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.globalNavigationBarRepository.createGlobalNavigationBar(type, position);
            const buttonMesh = button.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error creating My Card GNB Button:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustGlobalNavigationBarPosition(): void {
        const buttonList = this.getAllGlobalNavigationBarButton();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        buttonList.forEach((button) => {
            const buttonMesh = button.getMesh();
            const initialPosition = button.position;

            const buttonWidth = button.getWidthPercent() * windowWidth;
            const buttonHeight = button.getHeightPercent() * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getGlobalNavigationBarButtonById(id: number): GlobalNavigationBar | null {
        return this.globalNavigationBarRepository.findButtonById(id);
    }

    public deleteGlobalNavigationBarButtonById(id: number): void {
        this.globalNavigationBarRepository.deleteButtonById(id);
    }

    public getAllGlobalNavigationBarButton(): GlobalNavigationBar[] {
        return this.globalNavigationBarRepository.findAllButton();
    }

    public deleteAllGlobalNavigationBarButton(): void {
        this.globalNavigationBarRepository.deleteAllButton();
    }

}
