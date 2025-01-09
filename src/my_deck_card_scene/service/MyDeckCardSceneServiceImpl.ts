import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {MyDeckCardSceneService} from './MyDeckCardSceneService';
import {MyDeckCardScene} from "../entity/MyDeckCardScene";
import {MyDeckCardSceneRepository} from "../repository/MyDeckCardSceneRepository";
import {MyDeckCardSceneRepositoryImpl} from "../repository/MyDeckCardSceneRepositoryImpl";
import {MyDeckCardPositionRepositoryImpl} from "../../my_deck_card_position/repository/MyDeckCardPositionRepositoryImpl";
import {MyDeckCardPosition} from "../../my_deck_card_position/entity/MyDeckCardPosition";
import {MyDeckCardRepositoryImpl} from "../../my_deck_card/repository/MyDeckCardRepositoryImpl";
import {MyDeckCard} from "../../my_deck_card/entity/MyDeckCard";


export class MyDeckCardSceneServiceImpl implements MyDeckCardSceneService {
    private static instance: MyDeckCardSceneServiceImpl;
    private myDeckCardSceneRepository: MyDeckCardSceneRepositoryImpl;
    private myDeckCardPositionRepository: MyDeckCardPositionRepositoryImpl;
    private myDeckCardRepository: MyDeckCardRepositoryImpl;

    private constructor(myDeckCardSceneRepository: MyDeckCardSceneRepository) {
        this.myDeckCardSceneRepository = MyDeckCardSceneRepositoryImpl.getInstance();
        this.myDeckCardPositionRepository = MyDeckCardPositionRepositoryImpl.getInstance();
        this.myDeckCardRepository = MyDeckCardRepositoryImpl.getInstance();
    }

    public static getInstance(): MyDeckCardSceneServiceImpl {
        if (!MyDeckCardSceneServiceImpl.instance) {
            const repository = MyDeckCardSceneRepositoryImpl.getInstance();
            MyDeckCardSceneServiceImpl.instance = new MyDeckCardSceneServiceImpl(repository);
        }
        return MyDeckCardSceneServiceImpl.instance;
    }

    public async createMyDeckCardSceneWithPosition(deckId: number, cardIdList: number[]): Promise<THREE.Group | null> {
        const cardGroup = new THREE.Group();
        const cardList = Array.from(new Set(cardIdList));
        const positionIdList: number[] = [];

        try {
            for (let index = 0; index < cardList.length; index++) {
                const cardId = cardList[index];
                const position = this.myDeckCardPosition(cardId, index + 1);
                positionIdList.push(position.id);

                const deckCard = await this.createMyDeckCard(cardId, position.position);
                cardGroup.add(deckCard.getMesh());
            }
            // Scene 저장
            const myDeckCardScene = this.saveMyDeckCardScene(deckId, cardList, positionIdList);
            myDeckCardScene.addMeshes(cardGroup.children as THREE.Mesh[]);
        } catch (error) {
            console.error(`[Error] Failed to create MyDeckCardScene: ${error}`);
            return null;
        }
        return cardGroup;
    }

    public adjustMyDeckCardPosition(): void {
        const cardList = this.myDeckCardRepository.findAll();
        const cardPosition = this.myDeckCardPositionRepository.findAll();

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        console.log('cardList:', cardList);
        console.log('cardPosition:', cardPosition);

        for (const card of cardList) {
            console.log(`Card ID: ${card.id}`);
            const cardMesh = card.getMesh();
            const cardId = card.id;
            const initialPosition = this.myDeckCardPositionRepository.findById(cardId);
            console.log(`InitialPosition: ${initialPosition}`);

            if (!initialPosition) {
                console.error(`No position found for card id: ${cardId}`);
                continue;
            }

            const cardWidth = 0.126 * window.innerWidth;
            const cardHeight = 0.365 * window.innerHeight;

            const newPositionX = initialPosition.position.getX() * window.innerWidth;
            const newPositionY = initialPosition.position.getY() * window.innerHeight;
            console.log(`Card ${cardId}:`, {
                initialPosition: initialPosition.position,
                newPositionX,
                newPositionY,
            });

            cardMesh.geometry.dispose();
            cardMesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

            cardMesh.position.set(newPositionX, newPositionY, 0);
        }

    }

    private async createMyDeckCard(cardId: number, position: Vector2d): Promise<MyDeckCard> {
        return await this.myDeckCardRepository.createMyDeckCard(cardId, position);
    }

    private myDeckCardPosition(cardId: number, cardIndex: number): MyDeckCardPosition {
        const position = this.myDeckCardPositionRepository.addMyDeckCardPosition(cardIndex);
        this.myDeckCardPositionRepository.save(cardId, position);
        return position;
    }

    private saveMyDeckCardScene(deckId: number, cardIdList: number[], positionIdList: number[]): MyDeckCardScene {
        return this.myDeckCardSceneRepository.save(deckId, cardIdList, positionIdList)
    }

}
