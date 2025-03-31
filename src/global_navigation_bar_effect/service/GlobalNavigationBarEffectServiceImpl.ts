import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {GlobalNavigationBarEffectService} from './GlobalNavigationBarEffectService';
import {GlobalNavigationBarEffect} from "../entity/GlobalNavigationBarEffect";
import {GlobalNavigationBarEffectRepositoryImpl} from "../repository/GlobalNavigationBarEffectRepositoryImpl";
import {GlobalNavigationBarEffectStateManager} from "../../global_navigation_bar_manager/GlobalNavigationBarEffectStateManager";

export class GlobalNavigationBarEffectServiceImpl implements GlobalNavigationBarEffectService {
    private static instance: GlobalNavigationBarEffectServiceImpl;
    private globalNavigationBarEffectRepository: GlobalNavigationBarEffectRepositoryImpl;
    private globalNavigationBarEffectStateManager: GlobalNavigationBarEffectStateManager;

    private constructor() {
        this.globalNavigationBarEffectRepository = GlobalNavigationBarEffectRepositoryImpl.getInstance();
        this.globalNavigationBarEffectStateManager = GlobalNavigationBarEffectStateManager.getInstance();
    }

    public static getInstance(): GlobalNavigationBarEffectServiceImpl {
        if (!GlobalNavigationBarEffectServiceImpl.instance) {
            GlobalNavigationBarEffectServiceImpl.instance = new GlobalNavigationBarEffectServiceImpl();
        }
        return GlobalNavigationBarEffectServiceImpl.instance;
    }

    public async createGlobalNavigationBarEffect(type: number, position: Vector2d): Promise<THREE.Group | null> {
        const effectGroup = new THREE.Group();
        try {
            const effect = await this.globalNavigationBarEffectRepository.createGlobalNavigationBarEffect(type, position);
            const effectMesh = effect.getMesh();
            effectGroup.add(effectMesh);

        } catch (error) {
            console.error('Error creating My Card GNB Button Effect:', error);
            return null;
        }
        return effectGroup;
    }

    public adjustGlobalNavigationBarEffectPosition(): void {
        const effectList = this.getAllGlobalNavigationBarButtonEffect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        effectList.forEach((effect) => {
            const effectMesh = effect.getMesh();
            const initialPosition = effect.position;

            const effectWidth = effect.getWidthPercent() * windowWidth;
            const effectHeight = effectWidth * 0.6;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            effectMesh.geometry.dispose();
            effectMesh.geometry = new THREE.PlaneGeometry(effectWidth, effectHeight);

            effectMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getGlobalNavigationBarButtonEffectById(id: number): GlobalNavigationBarEffect | null {
        return this.globalNavigationBarEffectRepository.findEffectById(id);
    }

    public deleteGlobalNavigationBarButtonEffectById(id: number): void {
        this.globalNavigationBarEffectRepository.deleteEffectById(id);
    }

    public getAllGlobalNavigationBarButtonEffect(): GlobalNavigationBarEffect[] {
        return this.globalNavigationBarEffectRepository.findAllEffect();
    }

    public deleteAllGlobalNavigationBarButtonEffect(): void {
        this.globalNavigationBarEffectRepository.deleteAllEffect();
    }

    public initializeButtonEffectVisible(): void {
        const effectIdList = this.globalNavigationBarEffectRepository.findAllEffectIdList();
        effectIdList.forEach(effectId => {
            this.globalNavigationBarEffectStateManager.setVisibility(effectId, false);
        });
        this.globalNavigationBarEffectStateManager.setVisibility(2, true);
    }

}
