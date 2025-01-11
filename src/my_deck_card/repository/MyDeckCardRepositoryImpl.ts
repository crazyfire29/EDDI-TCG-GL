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

    // Todo: 나중에 기능 분리 필요
    private deckToCardMap: Map<number, Map<number, THREE.Mesh>> = new Map(); // dekId: [cardId: mesh] 형태로 관리
    private cardCountMap: Map<number, number> = new Map(); // Todo: deck id: [ card id: count] 형태로 변경 필요
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

    public async createMyDeckCardScene(cardId: number, position: Vector2d): Promise<MyDeckCard> {
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

        const newCard = new MyDeckCard(cardMesh, position);
        this.cardMap.set(newCard.id, newCard);

        return newCard;
    }

    public saveMyDeckCardSceneInfo(deckId: number, cardMeshMap: Map<number, THREE.Mesh>): void {
        if (!this.deckToCardMap.has(deckId)) {
            this.deckToCardMap.set(deckId, new Map());
        }

        const deckCardMap = this.deckToCardMap.get(deckId)!;
        cardMeshMap.forEach((mesh, cardId) => {
            deckCardMap.set(cardId, mesh);
        });
    }

    public saveNumberOfCards(cardIdList: number[]): Map<number, number> {
        const cardCountMap = new Map<number, number>();
        cardIdList.forEach(cardId => {
            const currentCount = cardCountMap.get(cardId) || 0;
            cardCountMap.set(cardId, currentCount + 1);
        });

        return cardCountMap;
    }

    public findCardByCardId(cardId: number): MyDeckCard | null {
        return this.cardMap.get(cardId) || null;
    }

    public findAllCard(): MyDeckCard[] {
        return Array.from(this.cardMap.values());
    }

    // 덱 id에 해당되는 모든 card 객체 불러오기
    public findCardMeshesByDeckId(deckId: number): THREE.Mesh[] {
        const deckCardMap = this.deckToCardMap.get(deckId);
        if (!deckCardMap) return [];

        return Array.from(deckCardMap.values());
    }

    // 특정 덱 id에 해당되는 특정 card 객체 불러오기
    // 예) 0번 덱의 카드 리스트중 3번 카드 불러오기
    public findCardMeshByDeckIdAndCardId(deckId: number, cardId: number): THREE.Mesh | null {
        const deckCardMap = this.deckToCardMap.get(deckId);
        if (!deckCardMap) {
            console.warn(`[WARN] Deck with ID ${deckId} not found`);
            return null;
        }

        const cardMesh = deckCardMap.get(cardId);
        if (!cardMesh) {
            console.warn(`[WARN] Card with ID ${cardId} not found in deck ${deckId}`);
            return null;
        }

        return cardMesh;
    }

    // 덱 만든 후 cardMap은 초기화 필요. 위치 정보 새로 저장을 위해
    public initialCardMap(): void {
        this.cardMap.clear();
    }

    public deleteCardByCardId(cardId: number): void {
        this.cardMap.delete(cardId);
    }

    // 사용자가 모든 덱을 삭제할 경우
    public deleteAllCard(): void {
        this.cardMap.clear();
        this.deckToCardMap.clear();
        this.cardCountMap.clear();
    }

    // 특정 덱을 삭제할 경우
    public deleteCardsByDeckId(deckId: number): void {
        this.deckToCardMap.delete(deckId);
    }

}
