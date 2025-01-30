import {TextureManager} from "../../texture_manager/TextureManager";
import {CardJob} from "../../card/job";
import * as THREE from "three";
import {OpponentFieldService} from "./OpponentFieldService";
import {getCardById} from "../../card/utility";
import {Vector2d} from "../../common/math/Vector2d";
import {OpponentFieldCardPositionRepositoryImpl} from "../../opponent_field_crad_position/repository/OpponentFieldCardPositionRepositoryImpl";
import {OpponentFieldCardPositionRepository} from "../../opponent_field_crad_position/repository/OpponentFieldCardPositionRepository";
import {OpponentFieldCardPosition} from "../../opponent_field_crad_position/entity/OpponentFieldCardPosition";
import {OpponentFieldCardSceneRepositoryImpl} from "../../opponent_field_card_scene/repository/OpponentFieldCradSceneRepositoryImpl";
import {OpponentFieldCardSceneRepository} from "../../opponent_field_card_scene/repository/OpponentFieldCradSceneRepository";
import {OpponentFieldCardScene} from "../../opponent_field_card_scene/entity/OpponentFieldCardScene";

export class OpponentFieldServiceImpl implements OpponentFieldService {
    private static instance: OpponentFieldServiceImpl;

    private opponentFieldCardPositionRepository: OpponentFieldCardPositionRepository
    private opponentFieldCardSceneRepository: OpponentFieldCardSceneRepository

    private textureManager: TextureManager = TextureManager.getInstance();

    // 1848, 949 -> 349, 335
    private readonly HALF: number = 0.5;
    private readonly GAP_OF_EACH_CARD: number = 0.094696
    private readonly OPPONENT_FIELD_X_CRITERIA: number = 0.186458
    private readonly OPPONENT_FIELD_Y_CRITERIA: number = 0.44564
    private readonly OPPONENT_FIELD_INITIAL_X: number = this.OPPONENT_FIELD_X_CRITERIA - this.HALF;
    private readonly OPPONENT_FIELD_INITIAL_Y: number = this.HALF - this.OPPONENT_FIELD_Y_CRITERIA;

    private readonly CARD_WIDTH: number = 0.06493506493
    private readonly CARD_HEIGHT: number = this.CARD_WIDTH * 1.615

    private static weaponTextureMap: { [key in CardJob]?: string } = {
        [CardJob.WARRIOR]: 'sword_power',
        [CardJob.MAGICIAN]: 'staff_power',
        [CardJob.ASSASSIN]: 'dagger_power',
    };

    private constructor() {
        this.opponentFieldCardPositionRepository = OpponentFieldCardPositionRepositoryImpl.getInstance()
        this.opponentFieldCardSceneRepository = OpponentFieldCardSceneRepositoryImpl.getInstance()
    }

    public static getInstance(): OpponentFieldServiceImpl {
        if (!this.instance) {
            this.instance = new OpponentFieldServiceImpl();
        }
        return this.instance;
    }

    async createFieldUnit(cardId: number): Promise<THREE.Group> {
        const cardGroup = new THREE.Group()
        const card = this.getCardByIdOrThrowError(cardId);

        const opponentFieldPosition = this.calculateOpponentFieldPosition();
        const createdOpponentFieldPosition = this.saveOpponentFieldPosition(opponentFieldPosition);

        const mainCardScene = await this.createMainCardScene(cardId, opponentFieldPosition);
        const mainCardMesh = mainCardScene.getMesh()
        cardGroup.add(mainCardMesh)

        return cardGroup
    }

    private getCardByIdOrThrowError(cardId: number): any {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card ${cardId} 찾지 못함.`);
        }
        return card;
    }

    private calculateOpponentFieldPosition(): Vector2d {
        const opponentFieldPositionCount = this.opponentFieldCardPositionRepository.count();
        const opponentFieldPositionX = (this.OPPONENT_FIELD_INITIAL_X + opponentFieldPositionCount * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const opponentFieldPositionY = this.OPPONENT_FIELD_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        return new Vector2d(opponentFieldPositionX, opponentFieldPositionY);
    }

    private saveOpponentFieldPosition(position: Vector2d): OpponentFieldCardPosition {
        const cardPosition = new OpponentFieldCardPosition(position.getX(), position.getY());
        return this.opponentFieldCardPositionRepository.save(cardPosition);
    }

    private async createMainCardScene(cardId: number, position: Vector2d): Promise<OpponentFieldCardScene> {
        return await this.opponentFieldCardSceneRepository.create(cardId, position);
    }
}