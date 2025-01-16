import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyDeckCardService} from "./MyDeckCardService";
import {MyDeckCard} from "../../my_deck_card/entity/MyDeckCard";
import {MyDeckCardRepository} from "../../my_deck_card/repository/MyDeckCardRepository";
import {MyDeckCardRepositoryImpl} from "../../my_deck_card/repository/MyDeckCardRepositoryImpl";
import {MyDeckCardPositionRepositoryImpl} from "../../my_deck_card_position/repository/MyDeckCardPositionRepositoryImpl";
import {MyDeckCardPosition} from "../../my_deck_card_position/entity/MyDeckCardPosition";
import {MyDeckButtonClickDetectRepositoryImpl} from "../../deck_button_click_detect/repository/MyDeckButtonClickDetectRepositoryImpl";
import {CardStateManager} from "../../my_deck_card_manager/CardStateManager";
import {CardPageManager} from "../../my_deck_card_manager/CardPageManager";

export class MyDeckCardServiceImpl implements MyDeckCardService {
    private static instance: MyDeckCardServiceImpl;
    private myDeckCardPositionRepository: MyDeckCardPositionRepositoryImpl;
    private myDeckCardRepository: MyDeckCardRepositoryImpl;
    private myDeckButtonClickDetectRepository: MyDeckButtonClickDetectRepositoryImpl;
    private cardStateManager: CardStateManager;
    private cardPageManager: CardPageManager;

    private constructor(myDeckCardRepository: MyDeckCardRepository) {
        this.myDeckCardPositionRepository = MyDeckCardPositionRepositoryImpl.getInstance();
        this.myDeckCardRepository = MyDeckCardRepositoryImpl.getInstance();
        this.myDeckButtonClickDetectRepository = MyDeckButtonClickDetectRepositoryImpl.getInstance();
        this.cardStateManager = CardStateManager.getInstance();
        this.cardPageManager = CardPageManager.getInstance();
    }

    public static getInstance(): MyDeckCardServiceImpl {
        if (!MyDeckCardServiceImpl.instance) {
            const repository = MyDeckCardRepositoryImpl.getInstance();
            MyDeckCardServiceImpl.instance = new MyDeckCardServiceImpl(repository);
        }
        return MyDeckCardServiceImpl.instance;
    }

    public async createMyDeckCardSceneWithPosition(deckId: number, cardIdList: number[]): Promise<THREE.Group | null> {
        const cardGroup = new THREE.Group();
        const cardList = Array.from(new Set(cardIdList));
        const cardMeshMap: Map<number, THREE.Mesh> = new Map();
        const positionMap: Map<number, MyDeckCardPosition> = new Map();

        try {
            // deck 마다 card 의 위치가 다름. cardMesh Map 초기화 필요.
            // 예) 0번 덱의 카드1과 3번 덱의 카드1의 위치가 다름.
            this.initialCardMap();
            this.initialPositionMap();
            const deckCards = await Promise.all(
                cardList.map(async (cardId, index) => {
                    const position = this.myDeckCardPosition(cardId, index + 1);
                    console.log(`[DEBUG] CardId ${cardId}: Position X=${position.position.getX()}, Y=${position.position.getY()}`);

                    const deckCard = await this.createMyDeckCard(cardId, position.position);
                    cardMeshMap.set(cardId, deckCard.getMesh());
                    positionMap.set(cardId, position);
                    cardGroup.add(deckCard.getMesh());
                })
            );

            this.saveMyDeckCardSceneInfo(deckId, cardMeshMap);
            this.saveCardPositionInfo(deckId, positionMap);
            console.log(`[DEBUG] cardGroup?: ${cardGroup.children}`);
        } catch (error) {
            console.error(`[Error] Failed to create MyDeckCardScene: ${error}`);
            return null;
        }
        return cardGroup;
    }

    // Todo: 현재 화면에 그려진 card가 어떤 덱의 카드인지 체크해야 함.
    public adjustMyDeckCardPosition(): void {
        const currentDeckButtonId = this.getCurrentClickDeckButton();
        if (currentDeckButtonId === null) {
            console.error("No deck button clicked");
            return;
        }

        const deckId = currentDeckButtonId + 1;
        const carIdList = this.getCardIdsByDeckId(deckId);
        const positionList = this.myDeckCardPositionRepository.findCardPositionByDeckId(deckId);
        const currentPageCardIdList = this.getCardIdsForPage(carIdList);

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        console.log(`[DEBUG] (adjust) positionList: ${positionList}`);
        console.log(`[DEBUG] (adjust) currentPageCardIdList: ${currentPageCardIdList}`);


        for (const cardId of currentPageCardIdList) {
            console.log(`[DEBUG] (adjust) Card ID: ${cardId}`);
            const cardMesh = this.getCardMeshIdByDeckIdAndCardId(deckId, cardId);
            if (!cardMesh) {
                console.warn(`[WARN] cardMesh with card ID ${cardId} not found`);
                return;
            }
            const initialPosition = this.getCardPositionByDeckIdAndCardId(deckId, cardId);
            console.log(`[DEBUG] (adjust) InitialPosition: ${initialPosition}`);

            if (!initialPosition) {
                console.error(`No position found for card id: ${cardId}`);
                continue;
            }

            const cardWidth = 0.126 * window.innerWidth;
            const cardHeight = 0.365 * window.innerHeight;

            const newPositionX = initialPosition.getX() * window.innerWidth;
            const newPositionY = initialPosition.getY() * window.innerHeight;
            console.log(`Card ${cardId}:`, {
                initialPosition: initialPosition,
                newPositionX,
                newPositionY,
            });

            cardMesh.geometry.dispose();
            cardMesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
            cardMesh.position.set(newPositionX, newPositionY, 0);
        }

    }

    private async createMyDeckCard(cardId: number, position: Vector2d): Promise<MyDeckCard> {
        return await this.myDeckCardRepository.createMyDeckCardScene(cardId, position);
    }

    private myDeckCardPosition(cardId: number, cardIndex: number): MyDeckCardPosition {
        const position = this.myDeckCardPositionRepository.addMyDeckCardPosition(cardIndex);
        this.myDeckCardPositionRepository.save(cardId, position);
        return position;
    }

    private saveMyDeckCardSceneInfo(deckId: number, cardMeshMap: Map<number, THREE.Mesh>): void {
        return this.myDeckCardRepository.saveMyDeckCardSceneInfo(deckId, cardMeshMap);
    }

    private saveCardPositionInfo(deckId: number, positionInfoMap: Map<number, MyDeckCardPosition>): void {
        return this.myDeckCardPositionRepository.savePositionInfo(deckId, positionInfoMap);
    }

    public getPositionByCardId(cardId: number): MyDeckCardPosition | null{
        return this.myDeckCardPositionRepository.findPositionByCardId(cardId);
    }

    public getCardMeshesByDeckId(deckId: number): THREE.Mesh[] {
        return this.myDeckCardRepository.findCardMeshesByDeckId(deckId);
    }

    public getCardPositionByDeckId(deckId: number): MyDeckCardPosition[] {
        return this.myDeckCardPositionRepository.findCardPositionByDeckId(deckId);
    }

    public getCardPositionByDeckIdAndCardId(deckId: number, cardId: number): MyDeckCardPosition | null {
        return this.myDeckCardPositionRepository.findPositionByDeckIdAndCardId(deckId, cardId);
    }

    public initialCardMap(): void {
        this.myDeckCardRepository.initialCardMap();
    }

    public initialPositionMap(): void {
        this.myDeckCardPositionRepository.initialPositionMap();
    }

    public initializeCardState(deckId: number, cardIdList: number[]): void {
        const uniqueCardIds = Array.from(new Set(cardIdList));
        this.cardStateManager.initializeCardState(deckId, uniqueCardIds);
        const cardMeshList = this.getCardMeshesByDeckId(deckId); // 버튼 찾기
        if (cardMeshList) {
            cardMeshList.forEach((mesh, index) => {
                mesh.visible = index < 8;
            });
        }
    }

    public setCardState(deckId: number, cardIdList: number[]): void {
        const uniqueCardIds = Array.from(new Set(cardIdList));
        this.cardStateManager.setAllCardVisibility(deckId, false);
        const cardMeshList = this.getCardMeshesByDeckId(deckId);
        if (cardMeshList){
            cardMeshList.forEach((mesh) => {
                mesh.visible = false;
            });
        }
    }

    public getCurrentClickDeckButton(): number | null {
        return this.myDeckButtonClickDetectRepository.getCurrentClickDeckButtonId();
    }

    public getCardIdsByDeckId(deckId: number): number[] {
        return this.myDeckCardRepository.findCardIdsByDeckId(deckId);
    }

    public getAllDeckIds(): number[] {
        return this.myDeckCardRepository.findDeckIds();
    }

    private getCardIdsForPage(cardIdList: number[]): number[] {
        const currentCardPage = this.cardPageManager.getCurrentPage();
        return this.cardPageManager.findCardIdsForPage(currentCardPage, cardIdList);
    }

    private getCardMeshIdByDeckIdAndCardId(deckId: number, cardId: number): THREE.Mesh | null {
        return this.myDeckCardRepository.findCardMeshByDeckIdAndCardId(deckId, cardId);
    }

}
