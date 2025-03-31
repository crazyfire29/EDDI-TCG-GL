import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";
import {MyCardScreenDetailCardService} from "./MyCardScreenDetailCardService";
import {MyCardScreenDetailCard} from "../entity/MyCardScreenDetailCard";
import {MyCardScreenDetailCardRepositoryImpl} from "../repository/MyCardScreenDetailCardRepositoryImpl";
import {DetailCardStateManager} from "../../my_card_screen_detail_card_manager/DetailCardStateManager";

export class MyCardScreenDetailCardServiceImpl implements MyCardScreenDetailCardService {
    private static instance: MyCardScreenDetailCardServiceImpl;
    private myCardScreenDetailCardRepository: MyCardScreenDetailCardRepositoryImpl;
    private detailCardStateManager: DetailCardStateManager;

    private constructor() {
        this.myCardScreenDetailCardRepository = MyCardScreenDetailCardRepositoryImpl.getInstance();
        this.detailCardStateManager = DetailCardStateManager.getInstance();
    }

    public static getInstance(): MyCardScreenDetailCardServiceImpl {
        if (!MyCardScreenDetailCardServiceImpl.instance) {
            MyCardScreenDetailCardServiceImpl.instance = new MyCardScreenDetailCardServiceImpl();
        }
        return MyCardScreenDetailCardServiceImpl.instance;
    }

    public async createMyCardDetailCard(cardId: number): Promise<THREE.Group | null> {
        const cardGroup = new THREE.Group();
        try {
            const position = new Vector2d(0, 0);
            const myCardScreenCard = await this.createDetailCard(cardId, position);

            cardGroup.add(myCardScreenCard.getMesh());

        } catch (error) {
            console.error(`[Error] Failed to create My Card Screen Card: ${error}`);
            return null;
        }
        return cardGroup;
    }

    public adjustDetailCardPosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const cardIdList = this.getAllCardIdList();
        for (const cardId of cardIdList) {
            const cardMesh = this.getCardMeshByCardId(cardId);
            if (!cardMesh) {
                console.warn(`[WARN] cardMesh with card ID ${cardId} not found`);
                continue;
            }

            const cardWidth = 0.2 * window.innerWidth;
            const cardHeight = cardWidth * 1.6176;

            const newPositionX = 0 * windowWidth;
            const newPositionY = 0 * windowHeight;
            console.log(`[DEBUG] (adjust) Card ${cardId}:`, {newPositionX, newPositionY});

            cardMesh.geometry.dispose();
            cardMesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
            cardMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    private async createDetailCard(cardId: number, position: Vector2d): Promise<MyCardScreenDetailCard> {
        return await this.myCardScreenDetailCardRepository.createDetailCard(cardId, position);
    }

    public getCardMeshByCardId(cardId: number): THREE.Mesh | null {
        const card = this.myCardScreenDetailCardRepository.findCardByCardId(cardId);
        if (!card) {
            console.warn(`[WARN] Card with ID ${cardId} not found`);
            return null;
        }
        const cardMesh = card.getMesh();
        return cardMesh;
    }

    public getAllCard(): MyCardScreenDetailCard[] {
        return this.myCardScreenDetailCardRepository.findAllCard();
    }

    public getAllCardIdList(): number[] {
        return this.myCardScreenDetailCardRepository.findAllCardIdList();
    }

    public setCardVisibility(cardId: number, isVisible: boolean): void {
        this.detailCardStateManager.setCardVisibility(cardId, isVisible);
    }

}
