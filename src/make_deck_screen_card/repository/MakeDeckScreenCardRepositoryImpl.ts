import * as THREE from 'three';
import {MakeDeckScreenCardRepository} from './MakeDeckScreenCardRepository';
import {MakeDeckScreenCard} from "../entity/MakeDeckScreenCard";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class MakeDeckScreenCardRepositoryImpl implements MakeDeckScreenCardRepository {
    private static instance: MakeDeckScreenCardRepositoryImpl;
    private cardUniqueIdMap: Map<number, number> = new Map(); // cardUniqueId: cardId
    private cardMap: Map<number, MakeDeckScreenCard> = new Map(); // cardId: mesh
    private raceMap: Map<string, number[]> = new Map(); // race: cardIdList
    private cardCountMap: Map<number, number> = new Map(); // card Id: count
    private textureManager: TextureManager;

    private readonly CARD_WIDTH: number = 0.112
    private readonly CARD_HEIGHT: number = 0.345

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MakeDeckScreenCardRepositoryImpl {
        if (!MakeDeckScreenCardRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MakeDeckScreenCardRepositoryImpl.instance = new MakeDeckScreenCardRepositoryImpl(textureManager);
        }
        return MakeDeckScreenCardRepositoryImpl.instance;
    }

    public async createMakeDeckScreenCard(cardId: number, position: Vector2d): Promise<MakeDeckScreenCard> {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card with ID ${cardId} not found`);
        }

        const texture = await this.textureManager.getTexture('owned_card', card.카드번호);
        if (!texture) {
            throw new Error(`Texture for card ${cardId} not found`);
        }

        const race = card.종족;

        const cardWidth = this.CARD_WIDTH * window.innerWidth;
        const cardHeight = this.CARD_HEIGHT * window.innerHeight;

        const cardPositionX = position.getX() * window.innerWidth;
        const cardPositionY = position.getY() * window.innerHeight;

        const cardMesh = MeshGenerator.createMesh(texture, cardWidth, cardHeight, position);
        cardMesh.position.set(cardPositionX, cardPositionY, 0);

        const newCard = new MakeDeckScreenCard(cardMesh, position);
        this.cardUniqueIdMap.set(newCard.id, cardId);
        this.cardMap.set(cardId, newCard);

        if (!this.raceMap.has(race)) {
            this.raceMap.set(race, []);
        }
        const cardIdList = this.raceMap.get(race)!;
        cardIdList.push(cardId);
        this.raceMap.set(race, cardIdList);

        return newCard;
    }

    public findCardByCardId(cardId: number): MakeDeckScreenCard | null {
        return this.cardMap.get(cardId) || null;
    }

    public findCardIdByCardUniqueId(cardUniqueId: number): number | null {
        return this.cardUniqueIdMap.get(cardUniqueId) || null;
    }

    public findAllCard(): MakeDeckScreenCard[] {
        return Array.from(this.cardMap.values());
    }

    public findCardIdList(): number[] {
        return Array.from(this.cardMap.keys());
    }

    public findCardsByRaceId(raceId: string): MakeDeckScreenCard[] | null {
        const cardIdList = this.raceMap.get(raceId);
        if (cardIdList === undefined) {
            return null;
        }
        const cardMeshList: MakeDeckScreenCard[] = [];
        cardIdList.forEach((cardId) => {
            const cardMesh = this.cardMap.get(cardId);
            if (cardMesh) {
                cardMeshList.push(cardMesh);
            } else {
                console.warn(`[WARN] Card with ID ${cardId} not found in cardMap`);
            }
        });

        return cardMeshList;
    }

    public findCardIdsByRaceId(raceId: string): number[] {
        return this.raceMap.get(raceId) || [];
    }

    // 모든 카드 없앰
    public deleteAllCard(): void {
        this.cardMap.clear();
        this.raceMap.clear();
        this.cardCountMap.clear();
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
