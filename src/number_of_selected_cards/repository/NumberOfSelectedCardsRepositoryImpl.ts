import * as THREE from 'three';
import {NumberOfSelectedCardsRepository} from './NumberOfSelectedCardsRepository';
import {NumberOfSelectedCards} from "../entity/NumberOfSelectedCards";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class NumberOfSelectedCardsRepositoryImpl implements NumberOfSelectedCardsRepository {
    private static instance: NumberOfSelectedCardsRepositoryImpl;
    private numberUniqueIdMap: Map<number, number> = new Map(); // numberUniqueId: cardCount
    private numberMap: Map<number, Map<number, NumberOfSelectedCards>> = new Map(); // cardId: {cardCount: mesh}
    private textureManager: TextureManager;

    private readonly NUMBER_WIDTH: number = 0.028
    private readonly NUMBER_HEIGHT: number = 0.034

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): NumberOfSelectedCardsRepositoryImpl {
        if (!NumberOfSelectedCardsRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            NumberOfSelectedCardsRepositoryImpl.instance = new NumberOfSelectedCardsRepositoryImpl(textureManager);
        }
        return NumberOfSelectedCardsRepositoryImpl.instance;
    }

    public async createNumberOfSelectedCards(clickedCardId: number, cardCount: number, position: Vector2d): Promise<NumberOfSelectedCards> {

        const texture = await this.textureManager.getTexture('number_of_selected_cards', cardCount);
        if (!texture) {
            throw new Error(`Texture for Number Of Selected Cards ${cardCount} not found`);
        }

        const numberWidth = this.NUMBER_WIDTH * window.innerWidth;
        const numberHeight = this.NUMBER_HEIGHT * window.innerHeight;

        const numberPositionX = position.getX() * window.innerWidth;
        const numberPositionY = position.getY() * window.innerHeight;

        const numberMesh = MeshGenerator.createMesh(texture, numberWidth, numberHeight, position);
        numberMesh.position.set(numberPositionX, numberPositionY, 0);

        const newNumber = new NumberOfSelectedCards(numberMesh, position);
        this.numberUniqueIdMap.set(newNumber.id, cardCount);

        if (!this.numberMap.has(clickedCardId)) {
            this.numberMap.set(clickedCardId, new Map());
        }
        this.numberMap.get(clickedCardId)!.set(cardCount, newNumber);

        return newNumber;
    }

    public findNumberByCardIdAndCardCount(clickedCardId: number, cardCount: number): NumberOfSelectedCards | null {
        return this.numberMap.get(clickedCardId)?.get(cardCount) || null;
    }

    public findAllNumber(): NumberOfSelectedCards[] {
        return Array.from(this.numberMap.values()).flatMap(map => Array.from(map.values()));
    }

    public findAllCardIds(): number[] {
        return Array.from(this.numberMap.keys());
    }

    public deleteAllNumber(): void {
        this.numberUniqueIdMap.clear();
        this.numberMap.clear();
    }

}
