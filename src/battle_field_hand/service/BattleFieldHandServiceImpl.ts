import {BattleFieldHandService} from "./BattleFieldHandService";
import {BattleFieldHandRepository} from "../repository/BattleFieldHandRepository";
import {BattleFieldHandRepositoryImpl} from "../repository/BattleFieldHandRepositoryImpl";
import {BattleFieldCardSceneRepository} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepository";
import {BattleFieldCardSceneRepositoryImpl} from "../../battle_field_card_scene/repository/BattleFieldCardSceneRepositoryImpl";
import {BattleFieldHandCardPositionRepository} from "../../battle_field_card_position/repository/BattleFieldHandCardPositionRepository";
import {BattleFieldHandCardPositionRepositoryImpl} from "../../battle_field_card_position/repository/BattleFieldHandCardPositionRepositoryImpl";
import {BattleFieldCardPosition} from "../../battle_field_card_position/entity/BattleFieldCardPosition";
import {Vector2d} from "../../common/math/Vector2d";
import {BattleFieldHand} from "../entity/BattleFieldHand";
import {BattleFieldHandMapRepository} from "../repository/BattleFieldHandMapRepository";
import {BattleFieldHandMapRepositoryImpl} from "../repository/BattleFieldHandMapRepositoryImpl";
import {getCardById} from "../../card/utility";
import * as THREE from "three";
import {BattleFieldCardScene} from "../../battle_field_card_scene/entity/BattleFieldCardScene";

export class BattleFieldHandServiceImpl implements BattleFieldHandService {
    private static instance: BattleFieldHandServiceImpl;

    private battleFieldHandRepository: BattleFieldHandRepository;
    private battleFieldHandMapRepository: BattleFieldHandMapRepository;
    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository;
    private battleFieldHandCardPositionRepository: BattleFieldHandCardPositionRepository;

    private readonly HALF: number = 0.5;
    private readonly GAP_OF_EACH_CARD: number = 0.094696
    private readonly HAND_X_CRITERIA: number = 0.311904
    private readonly HAND_Y_CRITERIA: number = 0.972107
    private readonly HAND_INITIAL_X: number = this.HAND_X_CRITERIA - this.HALF;
    private readonly HAND_INITIAL_Y: number = this.HALF - this.HAND_Y_CRITERIA;

    private readonly CARD_WIDTH: number = 0.06493506493
    private readonly CARD_HEIGHT: number = this.CARD_WIDTH * 1.615

    private constructor() {
        this.battleFieldHandRepository = BattleFieldHandRepositoryImpl.getInstance();
        this.battleFieldHandMapRepository = BattleFieldHandMapRepositoryImpl.getInstance();
        this.battleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance();
        this.battleFieldHandCardPositionRepository = BattleFieldHandCardPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): BattleFieldHandServiceImpl {
        if (!this.instance) {
            this.instance = new BattleFieldHandServiceImpl();
        }
        return this.instance;
    }

    async createHand(cardId: number): Promise<THREE.Group> {
        const cardGroup = new THREE.Group()
        const card = getCardById(cardId);

        const handPositionCount = this.battleFieldHandCardPositionRepository.count()
        console.log(`createHand() handPositionCount: ${handPositionCount}`)
        const handPositionX = (this.HAND_INITIAL_X + handPositionCount * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        const handPosition = new Vector2d(handPositionX, handPositionY);

        const cardPosition = new BattleFieldCardPosition(handPosition.getX(), handPosition.getY());
        console.log(`createHand() cardPosition: ${cardPosition}`)
        this.battleFieldHandCardPositionRepository.save(cardPosition);

        const createdCardScene: BattleFieldCardScene = await this.battleFieldCardSceneRepository.create(cardId, handPosition);
        const createdCardMesh = createdCardScene.getMesh()
        console.log(`createHand() createdCardMesh: ${createdCardMesh}`)
        console.log("Mesh Position:", createdCardMesh.position);
        console.log("Mesh Scale:", createdCardMesh.scale);
        console.log("Mesh Material:", createdCardMesh.material);
        cardGroup.add(createdCardMesh)
        console.log(`createHand() cardGroup: ${cardGroup}`)

        return cardGroup
    }

    createBattleFieldFirstDrawHand() {
        const handPositionCount = this.battleFieldHandCardPositionRepository.count()
        const handPositionX = (this.HAND_INITIAL_X + handPositionCount * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        const handPosition = new Vector2d(handPositionX, handPositionY);

        const cardPosition = new BattleFieldCardPosition(handPosition.getX(), handPosition.getY());
        this.battleFieldHandCardPositionRepository.save(cardPosition);

        // const cardScene = this.battleFieldCardSceneRepository.create(cardId, handPosition);

        // this.battleFieldHandCardPositionRepository.save()

        // BattleFieldCardPosition
        // this.battleFieldCardPositionRepository.save()
        // this.battleFieldCardSceneRepository.create(cardId)
        // this.battleFieldCardRepository.save(cardSceneId, positionId, attributeMarkIdList, status);

        return this.battleFieldHandRepository.save(1, 1, [1]);
    }

    // create(cardId: number): BattleFieldHand {
    //     const handPositionCount = this.battleFieldHandCardPositionRepository.count()
    //     const handPositionX = (this.HAND_INITIAL_X + handPositionCount * this.GAP_OF_EACH_CARD) * window.innerWidth;
    //     const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
    //         + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
    //     const handPosition = new Vector2d(handPositionX, handPositionY);
    //
    //     const cardPosition = new BattleFieldCardPosition(handPosition.getX(), handPosition.getY());
    //     this.battleFieldHandCardPositionRepository.save(cardPosition);
    //
    //     const cardScene = this.battleFieldCardSceneRepository.create(cardId, handPosition);
    //
    //     // this.battleFieldHandCardPositionRepository.save()
    //
    //     // BattleFieldCardPosition
    //     // this.battleFieldCardPositionRepository.save()
    //     // this.battleFieldCardSceneRepository.create(cardId)
    //     // this.battleFieldCardRepository.save(cardSceneId, positionId, attributeMarkIdList, status);
    //
    //     return this.battleFieldHandRepository.save(1, 1, [1]);
    // }
}
