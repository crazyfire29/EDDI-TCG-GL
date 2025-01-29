import * as THREE from 'three';
import {RaceButtonService} from './RaceButtonService';
import {CardRace} from "../../card/race";
import {RaceButton} from "../entity/RaceButton";
import {RaceButtonRepository} from "../repository/RaceButtonRepository";
import {RaceButtonRepositoryImpl} from "../repository/RaceButtonRepositoryImpl";
import {Vector2d} from "../../common/math/Vector2d";

export class RaceButtonServiceImpl implements RaceButtonService {
    private static instance: RaceButtonServiceImpl;
    private raceButtonRepository: RaceButtonRepository;

    private constructor(raceButtonRepository: RaceButtonRepository) {
        this.raceButtonRepository = raceButtonRepository;
    }

    public static getInstance(): RaceButtonServiceImpl {
        if (!RaceButtonServiceImpl.instance) {
            const raceButtonRepository = RaceButtonRepositoryImpl.getInstance();
            RaceButtonServiceImpl.instance = new RaceButtonServiceImpl(raceButtonRepository);
        }
        return RaceButtonServiceImpl.instance;
    }

    public async createRaceButton(
        type: CardRace,
        position: Vector2d
    ): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.raceButtonRepository.createRaceButton(type, position);
            const buttonMesh = button.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error creating Race Button:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustRaceButtonPosition(): void {
        const buttonList = this.getAllRaceButton();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        buttonList.forEach((button) => {
            const buttonMesh = button.getMesh();
            const initialPosition = button.position;

            const buttonWidth = (96 / 1920) * windowWidth;
            const buttonHeight = (94 / 1080) * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getRaceButtonById(id: number): RaceButton | null {
        return this.raceButtonRepository.findById(id);
    }

    public deleteRaceButtonById(id: number): void {
        this.raceButtonRepository.deleteById(id);
    }

    public getAllRaceButton(): RaceButton[] {
        return this.raceButtonRepository.findAll();
    }

    public deleteAllRaceButtons(): void {
        this.raceButtonRepository.deleteAll();
    }

}
