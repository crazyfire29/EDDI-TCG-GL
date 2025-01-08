import * as THREE from 'three';
import { MyDeckCardRepository } from './MyDeckCardRepository';
import {MyDeckCard} from "../entity/MyDeckCard";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class MyDeckCardRepositoryImpl implements MyDeckCardRepository {
    private static instance: MyDeckCardRepositoryImpl;
    private cardMap: Map<number, MyDeckCard> = new Map();
    private textureManager: TextureManager;

    private readonly CARD_WIDTH: number = 0.126
    private readonly CARD_HEIGHT: number = 0.365

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyDeckCardRepositoryImpl {
        if (!MyDeckCardRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyDeckCardRepositoryImpl.instance = new MyDeckCardRepositoryImpl(textureManager);
        }
        return MyDeckCardRepositoryImpl.instance;
    }

    public async createMyDeckCard(cardId: number, position: Vector2d): Promise<MyDeckCard> {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }

        const texture = await this.textureManager.getTexture('card', card.카드번호);
        if (!texture) {
            throw new Error(`Texture for card ${cardId} not found`);
        }

        const cardWidth = this.CARD_WIDTH * window.innerWidth;
        const cardHeight = this.CARD_HEIGHT * window.innerHeight;

        const cardPositionX = position.getX() * window.innerWidth;
        const cardPositionY = position.getY() * window.innerHeight;

        const cardMesh = MeshGenerator.createMesh(texture, cardWidth, cardHeight, position);
        cardMesh.position.set(cardPositionX, cardPositionY, 0);

        const newCard = new MyDeckCard(cardWidth, cardHeight, cardMesh, position);
        this.cardMap.set(newCard.id, newCard);

        return newCard;
    }


    public findById(cardId: number): MyDeckCard | null {
        return this.cardMap.get(cardId) || null;
    }

    public findAll(): MyDeckCard[] {
        return Array.from(this.cardMap.values());
    }

    public deleteById(cardId: number): void {
        this.cardMap.delete(cardId);
    }

    public deleteAll(): void {
        this.cardMap.clear();
    }

    hideById(carId: number): boolean {
        const card = this.findById(carId);
        if (card) {
            card.getMesh().visible = false;
            return true;
        }
        return false;
    }

    showById(carId: number): boolean {
        const card = this.findById(carId);
        if (card) {
            card.getMesh().visible = true;
            return true;
        }
        return false;
    }
}
