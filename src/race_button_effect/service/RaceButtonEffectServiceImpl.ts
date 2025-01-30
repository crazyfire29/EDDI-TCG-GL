import * as THREE from 'three';
import {RaceButtonEffectService} from './RaceButtonEffectService';
import {CardRace} from "../../card/race";
import {RaceButtonEffect} from "../entity/RaceButtonEffect";
import {RaceButtonEffectRepository} from "../repository/RaceButtonEffectRepository";
import {RaceButtonEffectRepositoryImpl} from "../repository/RaceButtonEffectRepositoryImpl";
import {Vector2d} from "../../common/math/Vector2d";

export class RaceButtonEffectServiceImpl implements RaceButtonEffectService {
    private static instance: RaceButtonEffectServiceImpl;
    private raceButtonEffectRepository: RaceButtonEffectRepository;

    private constructor(raceButtonEffectRepository: RaceButtonEffectRepository) {
        this.raceButtonEffectRepository = raceButtonEffectRepository;
    }

    public static getInstance(): RaceButtonEffectServiceImpl {
        if (!RaceButtonEffectServiceImpl.instance) {
            const raceButtonEffectRepository = RaceButtonEffectRepositoryImpl.getInstance();
            RaceButtonEffectServiceImpl.instance = new RaceButtonEffectServiceImpl(raceButtonEffectRepository);
        }
        return RaceButtonEffectServiceImpl.instance;
    }

    public async createRaceButtonEffect(
        type: CardRace,
        position: Vector2d
    ): Promise<THREE.Group | null> {
        const effectGroup = new THREE.Group();
        try {
            const effect = await this.raceButtonEffectRepository.createRaceButtonEffect(type, position);
            const effectMesh = effect.getMesh();
            effectGroup.add(effectMesh);

        } catch (error) {
            console.error('Error creating Race Button Effect:', error);
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

            const effectWidth = (96 / 1920) * windowWidth;
            const effectHeight = (94 / 1080) * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            effectMesh.geometry.dispose();
            effectMesh.geometry = new THREE.PlaneGeometry(effectWidth, effectHeight);

            effectMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getRaceButtonEffectById(id: number): RaceButtonEffect | null {
        return this.raceButtonEffectRepository.findById(id);
    }

    public deleteRaceButtonEffectById(id: number): void {
        this.raceButtonEffectRepository.deleteById(id);
    }

    public getAllRaceButtonEffect(): RaceButtonEffect[] {
        return this.raceButtonEffectRepository.findAll();
    }

    public deleteAllRaceButtonEffect(): void {
        this.raceButtonEffectRepository.deleteAll();
    }

    public initializeRaceButtonEffectVisible(): void {
        const effectIds = this.raceButtonEffectRepository.findAllEffectIds();
        effectIds.forEach((effectId) => {
            this.raceButtonEffectRepository.hideRaceButtonEffect(effectId);
        });
    }

}
