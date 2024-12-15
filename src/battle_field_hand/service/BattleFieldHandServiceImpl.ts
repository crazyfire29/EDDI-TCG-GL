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

export class BattleFieldHandServiceImpl implements BattleFieldHandService {
    private static instance: BattleFieldHandServiceImpl;

    private battleFieldHandRepository: BattleFieldHandRepository;
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

    private constructor(repository: BattleFieldHandRepository,
                        sceneRepository: BattleFieldCardSceneRepository,
                        handPositionRepository: BattleFieldHandCardPositionRepository) {
        this.battleFieldHandRepository = repository;
        this.battleFieldCardSceneRepository = sceneRepository;
        this.battleFieldHandCardPositionRepository = handPositionRepository;
    }

    public static getInstance(repository: BattleFieldHandRepository = BattleFieldHandRepositoryImpl.getInstance(),
                              sceneRepository: BattleFieldCardSceneRepository = BattleFieldCardSceneRepositoryImpl.getInstance(),
                              handPositionRepository: BattleFieldHandCardPositionRepository = BattleFieldHandCardPositionRepositoryImpl.getInstance()): BattleFieldHandServiceImpl {
        if (!BattleFieldHandServiceImpl.instance) {
            BattleFieldHandServiceImpl.instance = new BattleFieldHandServiceImpl(
                repository, sceneRepository, handPositionRepository);
        }
        return BattleFieldHandServiceImpl.instance;
    }

    create(cardId: number): BattleFieldHand {
        const handPositionCount = this.battleFieldHandCardPositionRepository.count()
        const handPositionX = (this.HAND_INITIAL_X + handPositionCount * this.GAP_OF_EACH_CARD) * window.innerWidth;
        const handPositionY = this.HAND_INITIAL_Y * window.innerHeight
            + (this.CARD_HEIGHT * this.HALF * window.innerWidth);
        const handPosition = new Vector2d(handPositionX, handPositionY);

        const cardPosition = new BattleFieldCardPosition(handPosition.getX(), handPosition.getY());
        this.battleFieldHandCardPositionRepository.save(cardPosition);

        const cardScene = this.battleFieldCardSceneRepository.create(cardId, handPosition);

        // this.battleFieldHandCardPositionRepository.save()

        // BattleFieldCardPosition
        // this.battleFieldCardPositionRepository.save()
        // this.battleFieldCardSceneRepository.create(cardId)
        // this.battleFieldCardRepository.save(cardSceneId, positionId, attributeMarkIdList, status);

        return this.battleFieldHandRepository.save(1, 1, [1]);
    }
}
