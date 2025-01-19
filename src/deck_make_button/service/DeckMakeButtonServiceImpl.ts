import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {DeckMakeButtonService} from './DeckMakeButtonService';
import {DeckMakeButton} from "../entity/DeckMakeButton";
import {DeckMakeButtonRepository} from "../repository/DeckMakeButtonRepository";
import {DeckMakeButtonRepositoryImpl} from "../repository/DeckMakeButtonRepositoryImpl";

export class DeckMakeButtonServiceImpl implements DeckMakeButtonService {
    private static instance: DeckMakeButtonServiceImpl;
    private deckMakeButtonRepository: DeckMakeButtonRepository;

    private constructor(deckMakeButtonRepository: DeckMakeButtonRepository) {
        this.deckMakeButtonRepository = deckMakeButtonRepository;
    }

    public static getInstance(): DeckMakeButtonServiceImpl {
        if (!DeckMakeButtonServiceImpl.instance) {
            const deckMakeButtonRepository = DeckMakeButtonRepositoryImpl.getInstance();
            DeckMakeButtonServiceImpl.instance = new DeckMakeButtonServiceImpl(deckMakeButtonRepository);
        }
        return DeckMakeButtonServiceImpl.instance;
    }

    public async createDeckMakeButton(): Promise<THREE.Mesh | null> {
        const button = await this.deckMakeButtonRepository.createDeckMakeButton('deckCreateButton');
        const buttonMesh = button.getMesh();

        return buttonMesh;
    }

    public adjustDeckMakeButtonPosition(): void {
        const button = this.getDeckMakeButton();
        if (!button) {
            console.error("DeckMakeButton is null. Cannot adjust position.");
            return;
        }

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const buttonMesh = button.getMesh();
        const initialPosition = button.position;

        const buttonWidth = (276 / 1920) * windowWidth;
        const buttonHeight = (60 / 1080) * windowHeight;

        const newPositionX = (-802 / 1920) * windowWidth;
        const newPositionY = (505 / 1080) * windowHeight;

        buttonMesh.geometry.dispose();
        buttonMesh.geometry = new THREE.PlaneGeometry(buttonWidth, buttonHeight);

        buttonMesh.position.set(newPositionX, newPositionY, 0);

    }

    public getDeckMakeButton(): DeckMakeButton | null {
        return this.deckMakeButtonRepository.findButton();
    }

    public deleteDeckMakeButton(): void {
        this.deckMakeButtonRepository.deleteButton();
    }

}
