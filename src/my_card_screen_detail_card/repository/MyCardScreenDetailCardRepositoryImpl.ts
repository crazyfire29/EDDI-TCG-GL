import * as THREE from 'three';
import {MyCardScreenDetailCardRepository} from './MyCardScreenDetailCardRepository';
import {MyCardScreenDetailCard} from "../entity/MyCardScreenDetailCard";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class MyCardScreenDetailCardRepositoryImpl implements MyCardScreenDetailCardRepository {
    private static instance: MyCardScreenDetailCardRepositoryImpl;
    private cardMap: Map<number, { cardId: number, cardMesh: MyCardScreenDetailCard }> = new Map(); // cardUniqueId: {cardId: mesh}
    private textureManager: TextureManager;

    private readonly CARD_WIDTH: number = 0.2 //0.109
    private readonly CARD_HEIGHT: number = 0.63688 //0.3471

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardScreenDetailCardRepositoryImpl {
        if (!MyCardScreenDetailCardRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardScreenDetailCardRepositoryImpl.instance = new MyCardScreenDetailCardRepositoryImpl(textureManager);
        }
        return MyCardScreenDetailCardRepositoryImpl.instance;
    }

    public async createDetailCard(cardId: number, position: Vector2d): Promise<MyCardScreenDetailCard> {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }

        const texture = await this.textureManager.getTexture('owned_card', card.카드번호);
        if (!texture) {
            throw new Error(`Texture for card ${cardId} not found`);
        }

        const cardWidth = this.CARD_WIDTH * window.innerWidth;
        const cardHeight = this.CARD_HEIGHT * window.innerHeight;

        const cardPositionX = position.getX() * window.innerWidth;
        const cardPositionY = position.getY() * window.innerHeight;

        const cardMesh = MeshGenerator.createMesh(texture, cardWidth, cardHeight, position);
        cardMesh.position.set(cardPositionX, cardPositionY, 0);

        const newCard = new MyCardScreenDetailCard(cardMesh, position);
        this.cardMap.set(newCard.id, { cardId: cardId, cardMesh: newCard });

        return newCard;
    }

    public findCardByCardId(cardId: number): MyCardScreenDetailCard | null {
        for (const { cardId: storedCardId, cardMesh } of this.cardMap.values()) {
            if (storedCardId === cardId) {
                return cardMesh;
            }
        }
        return null;
    }

    public findCardByCardUniqueId(uniqueId: number): MyCardScreenDetailCard | null {
        const card = this.cardMap.get(uniqueId);
        if (card) {
            return card.cardMesh;
        } else {
            return null;
        }
    }

    public findCardIdByCardUniqueId(cardUniqueId: number): number | null {
        const card = this.cardMap.get(cardUniqueId);
        if (card) {
            return card.cardId;
        } else {
            return null;
        }
    }

    public findAllCard(): MyCardScreenDetailCard[] {
        return Array.from(this.cardMap.values()).map(({ cardMesh }) => cardMesh);
    }

    public findAllCardIdList(): number[] {
        return Array.from(this.cardMap.values()).map(({ cardId }) => cardId);
    }

    public deleteAllCard(): void {
        this.cardMap.clear();
    }

    public hideCard(cardId: number): void {
        const card = this.findCardByCardId(cardId);
        if (card) {
            card.getMesh().visible = false;
        }
    }

    public showCard(cardId: number): void {
        const card = this.findCardByCardId(cardId);
        if (card) {
            card.getMesh().visible = true;
        }
    }

}
