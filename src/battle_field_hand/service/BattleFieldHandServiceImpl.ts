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
import {CardJob} from "../../card/job";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {BattleFieldCardAttributeMarkRepository} from "../../battle_field_card_attribute_mark/repository/BattleFieldCardAttributeMarkRepository";
import {BattleFieldCardAttributeMarkRepositoryImpl} from "../../battle_field_card_attribute_mark/repository/BattleFieldCardAttributeMarkRepositoryImpl";
import {BattleFieldCardAttributeMarkPositionRepository} from "../../battle_field_card_attribute_mark_position/repository/BattleFieldCardAttributeMarkPositionRepository";
import {BattleFieldCardAttributeMarkPositionRepositoryImpl} from "../../battle_field_card_attribute_mark_position/repository/BattleFieldCardAttributeMarkPositionRepositoryImpl";
import {BattleFieldCardAttributeMarkSceneRepository} from "../../battle_field_card_attribute_mark_scene/repository/BattleFieldCardAttributeMarkSceneRepository";
import {BattleFieldCardAttributeMarkSceneRepositoryImpl} from "../../battle_field_card_attribute_mark_scene/repository/BattleFieldCardAttributeMarkSceneRepositoryImpl";
import {BattleFieldCardAttributeMarkPosition} from "../../battle_field_card_attribute_mark_position/entity/BattleFieldCardAttributeMarkPosition";
import {BattleFieldCardAttributeMarkScene} from "../../battle_field_card_attribute_mark_scene/entity/BattleFieldCardAttributeMarkScene";
import {BattleFieldCardAttributeMark} from "../../battle_field_card_attribute_mark/entity/BattleFieldCardAttributeMark";
import {BattleFieldCardAttributeMarkStatus} from "../../battle_field_card_attribute_mark/entity/BattleFieldCardAttributeMarkStatus";

export class BattleFieldHandServiceImpl implements BattleFieldHandService {
    private static instance: BattleFieldHandServiceImpl;

    private battleFieldHandRepository: BattleFieldHandRepository;
    private battleFieldHandMapRepository: BattleFieldHandMapRepository;
    private battleFieldCardSceneRepository: BattleFieldCardSceneRepository;
    private battleFieldHandCardPositionRepository: BattleFieldHandCardPositionRepository;

    private battleFieldCardAttributeMarkRepository: BattleFieldCardAttributeMarkRepository;
    private battleFieldCardAttributeMarkSceneRepository: BattleFieldCardAttributeMarkSceneRepository;
    private battleFieldCardAttributeMarkPositionRepository: BattleFieldCardAttributeMarkPositionRepository;

    private textureManager: TextureManager = TextureManager.getInstance();

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

        this.battleFieldCardAttributeMarkRepository = BattleFieldCardAttributeMarkRepositoryImpl.getInstance();
        this.battleFieldCardAttributeMarkSceneRepository = BattleFieldCardAttributeMarkSceneRepositoryImpl.getInstance();
        this.battleFieldCardAttributeMarkPositionRepository = BattleFieldCardAttributeMarkPositionRepositoryImpl.getInstance();
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

        if (!card) {
            throw new Error(`Card ${cardId} 찾지 못함.`);
        }

        const handPositionCount = this.battleFieldHandCardPositionRepository.count()

        const handPositionX = (this.HAND_INITIAL_X + handPositionCount * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        const handPosition = new Vector2d(handPositionX, handPositionY);

        const cardPosition = new BattleFieldCardPosition(handPosition.getX(), handPosition.getY());
        this.battleFieldHandCardPositionRepository.save(cardPosition);

        const createdCardScene: BattleFieldCardScene = await this.battleFieldCardSceneRepository.create(cardId, handPosition);
        const createdCardMesh = createdCardScene.getMesh()
        cardGroup.add(createdCardMesh)

        const unitJob = parseInt(card.병종, 10);

        try {
            const textures = await this.loadCardTextures(unitJob, card);
            const [weaponTexture, raceTexture, hpTexture, energyTexture] = textures;

            const weaponPosition = new Vector2d(
                handPosition.getX() + this.CARD_WIDTH * 0.44 * window.innerWidth,
                handPosition.getY() - this.CARD_HEIGHT * 0.45666 * window.innerWidth);

            const attributeMarkPosition = new BattleFieldCardAttributeMarkPosition(weaponPosition.getX(), weaponPosition.getY())
            await this.battleFieldCardAttributeMarkPositionRepository.save(attributeMarkPosition)

            if (weaponTexture) {
                const weaponMesh = MeshGenerator.createMesh(
                    weaponTexture,
                    this.CARD_WIDTH * 0.63 * window.innerWidth,
                    this.CARD_WIDTH * 0.63 * 1.651 * window.innerWidth,
                    weaponPosition)

                const attributeMarkScene = new BattleFieldCardAttributeMarkScene(weaponMesh)
                await this.battleFieldCardAttributeMarkSceneRepository.save(attributeMarkScene)

                const attributeMark = new BattleFieldCardAttributeMark(BattleFieldCardAttributeMarkStatus.HAND, attributeMarkScene.getId(), attributeMarkPosition.getId())
                await this.battleFieldCardAttributeMarkRepository.save(attributeMark)

                cardGroup.add(weaponMesh)
            }
        } catch (error) {
            console.error("Error loading textures:", error);
        }

        return cardGroup
    }

    async loadCardTextures(unitJob: number, card: any): Promise<(THREE.Texture | null)[]> {
        const textures = await Promise.all([
            unitJob === CardJob.WARRIOR ? this.textureManager.getTexture('sword_power', card.공격력) : null,
            this.textureManager.getTexture('race', card.종족),
            this.textureManager.getTexture('hp', card.체력),
            this.textureManager.getTexture('energy', 0),
        ]);

        return textures.map(texture => texture ?? null)
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
