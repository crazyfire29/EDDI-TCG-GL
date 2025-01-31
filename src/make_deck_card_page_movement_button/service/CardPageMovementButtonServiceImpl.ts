import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {CardPageMovementButtonService} from './CardPageMovementButtonService';
import {CardPageMovementButtonType} from "../entity/CardPageMovementButtonType";
import {CardPageMovementButton} from "../entity/CardPageMovementButton";
import {CardPageMovementButtonRepository} from "../repository/CardPageMovementButtonRepository";
import {CardPageMovementButtonRepositoryImpl} from "../repository/CardPageMovementButtonRepositoryImpl";

export class CardPageMovementButtonServiceImpl implements CardPageMovementButtonService {
    private static instance: CardPageMovementButtonServiceImpl;
    private cardPageMovementButtonRepository: CardPageMovementButtonRepository;

    private constructor(cardPageMovementButtonRepository: CardPageMovementButtonRepository) {
        this.cardPageMovementButtonRepository = cardPageMovementButtonRepository;
    }

    public static getInstance(): CardPageMovementButtonServiceImpl {
        if (!CardPageMovementButtonServiceImpl.instance) {
            const cardPageMovementButtonRepository = CardPageMovementButtonRepositoryImpl.getInstance();
            CardPageMovementButtonServiceImpl.instance = new CardPageMovementButtonServiceImpl(cardPageMovementButtonRepository);
        }
        return CardPageMovementButtonServiceImpl.instance;
    }

    public async createCardPageMovementButton(
        type: CardPageMovementButtonType,
        position: Vector2d
    ): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.cardPageMovementButtonRepository.createCardPageMovementButton(type, position);
            const buttonMesh = button.getMesh();
            buttonGroup.add(buttonMesh);

        } catch (error) {
            console.error('Error creating Card Page Movement Button:', error);
            return null;
        }
        return buttonGroup;
    }

    public adjustCardPageMovementButtonPosition(): void {
        const buttonList = this.getAllCardPageMovementButtons();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        buttonList.forEach((button) => {
            const buttonMesh = button.getMesh();
            const initialPosition = button.position;

            const buttonWidth = (110 / 1920) * windowWidth;
            const buttonHeight = (130 / 1080) * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            buttonMesh.geometry.dispose();
            buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

            buttonMesh.position.set(newPositionX, newPositionY, 0);
        });

    }

    public getCardPageMovementButtonById(id: number): CardPageMovementButton | null {
        return this.cardPageMovementButtonRepository.findById(id);
    }

    public deleteCardPageMovementButtonById(id: number): void {
        this.cardPageMovementButtonRepository.deleteById(id);
    }

    public getAllCardPageMovementButtons(): CardPageMovementButton[] {
        return this.cardPageMovementButtonRepository.findAll();
    }

    public deleteAllCardPageMovementButtons(): void {
        this.cardPageMovementButtonRepository.deleteAll();
    }

}
