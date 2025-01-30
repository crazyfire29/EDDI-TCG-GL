
import {TextureManager} from "../../texture_manager/TextureManager";
import {CardJob} from "../../card/job";
import * as THREE from "three";
import {OpponentFieldService} from "./OpponentFieldService";
import {getCardById} from "../../card/utility";
import {Vector2d} from "../../common/math/Vector2d";

export class OpponentFieldServiceImpl implements OpponentFieldService {
    private static instance: OpponentFieldServiceImpl;

    private textureManager: TextureManager = TextureManager.getInstance();

    private readonly HALF: number = 0.5;
    private readonly GAP_OF_EACH_CARD: number = 0.094696
    private readonly HAND_X_CRITERIA: number = 0.311904
    private readonly HAND_Y_CRITERIA: number = 0.972107
    private readonly HAND_INITIAL_X: number = this.HAND_X_CRITERIA - this.HALF;
    private readonly HAND_INITIAL_Y: number = this.HALF - this.HAND_Y_CRITERIA;

    private readonly CARD_WIDTH: number = 0.06493506493
    private readonly CARD_HEIGHT: number = this.CARD_WIDTH * 1.615

    private static weaponTextureMap: { [key in CardJob]?: string } = {
        [CardJob.WARRIOR]: 'sword_power',
        [CardJob.MAGICIAN]: 'staff_power',
        [CardJob.ASSASSIN]: 'dagger_power',
    };

    private constructor() {

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
    }

    private getCardByIdOrThrowError(cardId: number): any {
        const card = getCardById(cardId);
        if (!card) {
            throw new Error(`Card ${cardId} 찾지 못함.`);
        }
        return card;
    }


}