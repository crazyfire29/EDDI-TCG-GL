import * as THREE from 'three';
import {NumberOfOwnedCardsRepository} from './NumberOfOwnedCardsRepository';
import {NumberOfOwnedCards} from "../entity/NumberOfOwnedCards";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class NumberOfOwnedCardsRepositoryImpl implements NumberOfOwnedCardsRepository {
    private static instance: NumberOfOwnedCardsRepositoryImpl;
    private numberUniqueIdMap: Map<number, number> = new Map(); // numberUniqueId: cardId
    private numberMap: Map<number, { cardCount: number,  numberMesh: NumberOfOwnedCards }> = new Map(); // cardId: {cardCount: mesh}
    private textureManager: TextureManager;

    private readonly NUMBER_WIDTH: number = 0.03
    private readonly NUMBER_HEIGHT: number = 0.034

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): NumberOfOwnedCardsRepositoryImpl {
        if (!NumberOfOwnedCardsRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            NumberOfOwnedCardsRepositoryImpl.instance = new NumberOfOwnedCardsRepositoryImpl(textureManager);
        }
        return NumberOfOwnedCardsRepositoryImpl.instance;
    }

    public async createNumberOfOwnedCards(cardId: number, cardCount: number, position: Vector2d): Promise<NumberOfOwnedCards> {

        const texture = await this.textureManager.getTexture('number_of_owned_cards', cardCount);
        if (!texture) {
            throw new Error(`Texture for Number Of Owned Cards ${cardCount} not found`);
        }

        const numberWidth = this.NUMBER_WIDTH * window.innerWidth;
        const numberHeight = this.NUMBER_HEIGHT * window.innerHeight;

        const numberPositionX = position.getX() * window.innerWidth;
        const numberPositionY = position.getY() * window.innerHeight;

        const numberMesh = MeshGenerator.createMesh(texture, numberWidth, numberHeight, position);
        numberMesh.position.set(numberPositionX, numberPositionY, 0);

        const newNumber = new NumberOfOwnedCards(numberMesh, position);
        this.numberUniqueIdMap.set(newNumber.id, cardId);
        this.numberMap.set(cardId, { cardCount: cardCount, numberMesh: newNumber });

        return newNumber;
    }

    public findNumberByCardId(cardId: number): NumberOfOwnedCards | null {
        const number = this.numberMap.get(cardId);
        if (number) {
            return number.numberMesh;
        } else {
            return null;
        }
    }

    public findNumberByNumberId(numberId: number): NumberOfOwnedCards | null {
        const cardId = this.numberUniqueIdMap.get(numberId);
        if (cardId !== undefined) {
            return this.findNumberByCardId(cardId);
        } else {
            return null;
        }
    }

    public findAllNumber(): NumberOfOwnedCards[] {
        return Array.from(this.numberMap.values()).map(({ numberMesh }) => numberMesh);
    }

    public findAllCardIds(): number[] {
        return Array.from(this.numberMap.keys());
    }

    public findCardCountByCardId(cardId: number): number | null {
        const number = this.numberMap.get(cardId);
        if (number) {
            return number.cardCount;
        } else {
            return null;
        }
    }

    public deleteAllNumber(): void {
        this.numberUniqueIdMap.clear();
        this.numberMap.clear();
    }

    public deleteNumberByCardId(cardId: number): void {
        // numberUniqueIdMap에서 cardId를 키로 가진 numberUniqueId 찾기
        const numberUniqueId = [...this.numberUniqueIdMap.entries()].find(([, storedCardId]) => storedCardId === cardId)?.[0];

        // 찾은 numberUniqueId가 존재하면 삭제
        if (numberUniqueId !== undefined) {
            this.numberUniqueIdMap.delete(numberUniqueId);
        }

        this.numberMap.delete(cardId);
    }

    public deleteNumberByNumberUniqueId(numberId: number): void {
        const cardId = this.numberUniqueIdMap.get(numberId);
        if (cardId !== undefined) {
            this.numberMap.delete(cardId);
        }
        this.numberUniqueIdMap.delete(numberId);
    }

    public hasCardId(carId: number): boolean {
        return this.numberMap.has(carId);
    }

    public hideNumber(cardId: number): void {
        const number = this.findNumberByCardId(cardId);
        if (number) {
            number.getMesh().visible = false;
        }
    }

    public showNumber(cardId: number): void {
        const number = this.findNumberByCardId(cardId);
        if (number) {
            number.getMesh().visible = true;
        }
    }

}
