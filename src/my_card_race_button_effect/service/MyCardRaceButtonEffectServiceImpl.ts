import * as THREE from 'three';
import {MyCardRaceButtonEffectService} from './MyCardRaceButtonEffectService';
import {MyCardRaceButtonEffect} from "../entity/MyCardRaceButtonEffect";
import {MyCardRaceButtonEffectRepositoryImpl} from "../repository/MyCardRaceButtonEffectRepositoryImpl";
import {CardRace} from "../../card/race";
import {Vector2d} from "../../common/math/Vector2d";

export class MyCardRaceButtonEffectServiceImpl implements MyCardRaceButtonEffectService {
    private static instance: MyCardRaceButtonEffectServiceImpl;
    private myCardRaceButtonEffectRepository: MyCardRaceButtonEffectRepositoryImpl;

    private constructor() {
        this.myCardRaceButtonEffectRepository = MyCardRaceButtonEffectRepositoryImpl.getInstance();
    }

    public static getInstance(): MyCardRaceButtonEffectServiceImpl {
        if (!MyCardRaceButtonEffectServiceImpl.instance) {
            MyCardRaceButtonEffectServiceImpl.instance = new MyCardRaceButtonEffectServiceImpl();
        }
        return MyCardRaceButtonEffectServiceImpl.instance;
    }

    public async createRaceButtonEffect(type: CardRace, position: Vector2d): Promise<THREE.Group | null> {
        const effectGroup = new THREE.Group();
        try {
            const effect = await this.myCardRaceButtonEffectRepository.createRaceButtonEffect(type, position);
            const effectMesh = effect.getMesh();
            effectGroup.add(effectMesh);

        } catch (error) {
            console.error('Error creating My Card Race Button Effect:', error);
            return null;
        }
        return effectGroup;
    }

    public adjustRaceButtonEffectPosition(): void {
        const effectList = this.getAllRaceButtonEffect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        effectList.forEach((effect) => {
            const effectMesh = effect.getMesh();
            const initialPosition = effect.position;

            const effectWidth = 0.068 * windowWidth;
            const effectHeight = 0.131 * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            effectMesh.geometry.dispose();
            effectMesh.geometry = new THREE.PlaneGeometry(effectWidth, effectHeight);

            effectMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getRaceButtonEffectById(id: number): MyCardRaceButtonEffect | null {
        return this.myCardRaceButtonEffectRepository.findEffectById(id);
    }

    public deleteRaceButtonEffectById(id: number): void {
        this.myCardRaceButtonEffectRepository.deleteById(id);
    }

    public getAllRaceButtonEffect(): MyCardRaceButtonEffect[] {
        return this.myCardRaceButtonEffectRepository.findAllEffect();
    }

    public deleteAllRaceButtonEffect(): void {
        this.myCardRaceButtonEffectRepository.deleteAll();
    }

}
