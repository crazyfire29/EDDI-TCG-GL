import * as THREE from 'three';
import {MyCardScreenCardRepository} from './MyCardScreenCardRepository';
import {MyCardScreenCard} from "../entity/MyCardScreenCard";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class MyCardScreenCardRepositoryImpl implements MyCardScreenCardRepository {
    private static instance: MyCardScreenCardRepositoryImpl;
    private cardMap: Map<number, { cardId: number, cardMesh: MyCardScreenCard }> = new Map(); // cardUniqueId: {cardId: mesh}
    private raceMap: Map<string, number[]> = new Map(); // race: cardIdList
    private cardCountMap: Map<number, number> = new Map(); // card Id: count
    private humanCardGroup: THREE.Group | null = null;
    private undeadCardGroup: THREE.Group | null = null;
    private trentCardGroup: THREE.Group | null = null;
    private textureManager: TextureManager;

    private readonly CARD_WIDTH: number = 0.12 //0.109 // 0.112
    private readonly CARD_HEIGHT: number = 0.3821284404 //0.3471 // 0.356653211

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardScreenCardRepositoryImpl {
        if (!MyCardScreenCardRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardScreenCardRepositoryImpl.instance = new MyCardScreenCardRepositoryImpl(textureManager);
        }
        return MyCardScreenCardRepositoryImpl.instance;
    }

    public async createMyCardScreenCard(cardId: number, cardCount: number, position: Vector2d): Promise<MyCardScreenCard> {
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

        const newCard = new MyCardScreenCard(cardMesh, position);
        this.cardMap.set(newCard.id, { cardId: cardId, cardMesh: newCard });
        this.cardCountMap.set(cardId, cardCount);

        if (!this.raceMap.has(race)) {
            this.raceMap.set(race, []);
        }
        const cardIdList = this.raceMap.get(race)!;
        cardIdList.push(cardId);
        this.raceMap.set(race, cardIdList);

        return newCard;
    }

    public findCardByCardId(cardId: number): MyCardScreenCard | null {
        for (const { cardId: storedCardId, cardMesh } of this.cardMap.values()) {
            if (storedCardId === cardId) {
                return cardMesh;
            }
        }
        return null;
    }

    public findCardByCardUniqueId(uniqueId: number): MyCardScreenCard | null {
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

    public findAllCard(): MyCardScreenCard[] {
        return Array.from(this.cardMap.values()).map(({ cardMesh }) => cardMesh);
    }

    public findAllCardIdList(): number[] {
        return Array.from(this.cardMap.values()).map(({ cardId }) => cardId);
    }

    public findCardCountByCardId(cardId: number): number | null {
        return this.cardCountMap.get(cardId) || null;
    }

    public findCardListByRaceId(raceId: string): MyCardScreenCard[] | null {
        const cardIdList = this.raceMap.get(raceId);
        if (cardIdList === undefined) {
            return null;
        }
        const cardMeshList: MyCardScreenCard[] = [];
        cardIdList.forEach((cardId) => {
            const cardMesh = this.findCardByCardId(cardId);
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

    public findHumanCardGroup(): THREE.Group {
        if (!this.humanCardGroup) {
            this.humanCardGroup = new THREE.Group();
            this.findCardListByRaceId("1")?.forEach((card) => {
                this.humanCardGroup!.add(card.getMesh());
            });
        }
        return this.humanCardGroup;
    }

    public findUndeadCardGroup(): THREE.Group {
        if (!this.undeadCardGroup) {
            this.undeadCardGroup = new THREE.Group();
            this.findCardListByRaceId("2")?.forEach((card) => {
                this.undeadCardGroup!.add(card.getMesh());
            });
        }
        return this.undeadCardGroup;
    }

    public findTrentCardGroup(): THREE.Group {
        if (!this.trentCardGroup) {
            this.trentCardGroup = new THREE.Group();
            this.findCardListByRaceId("3")?.forEach((card) => {
                this.trentCardGroup!.add(card.getMesh());
            });
        }
        return this.trentCardGroup;
    }

    public findCardGroupsByRaceId(raceId: string): THREE.Group {
        const cardIdList = this.findCardIdsByRaceId(raceId);
        const cardGroup = new THREE.Group();

        cardIdList.forEach((cardId) => {
            const cardMesh = this.findCardByCardId(cardId);
            if (cardMesh) {
                cardGroup.add(cardMesh.getMesh());
            } else {
                console.warn(`[WARN] Card with ID ${cardId} not found in cardMap`);
            }
        });

        return cardGroup;
    }

    public resetCardGroups(): void {
        this.humanCardGroup = null;
        this.undeadCardGroup = null;
        this.trentCardGroup = null;
    }

    public getCardCountByRaceId(raceId: string): number {
        return this.raceMap.get(raceId)?.length || 0;
    }

}
