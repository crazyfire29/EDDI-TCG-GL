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
import {CardKind} from "../../card/kind";
import {Texture} from "three";
import {MeshGenerator} from "../../mesh/generator";
import {Card} from "../../card/types";
import {OpponentFieldRepositoryImpl} from "../repository/OpponentFieldRepositoryImpl";
import {OpponentFieldRepository} from "../repository/OpponentFieldRepository";
import {OpponentFieldCardAttributeMarkPositionRepository} from "../../opponent_field_card_attribute_mark_position/repository/OpponentFieldCardAttributeMarkPositionRepository";
import {OpponentFieldCardAttributeMarkSceneRepository} from "../../opponent_field_card_attribute_mark_scene/repository/OpponentFieldCardAttributeMarkSceneRepository";
import {OpponentFieldCardAttributeMarkRepository} from "../../opponent_field_card_attribute_mark/repository/OpponentFieldCardAttributeMarkRepository";
import {OpponentFieldCardAttributeMarkPositionRepositoryImpl} from "../../opponent_field_card_attribute_mark_position/repository/OpponentFieldCardAttributeMarkPositionRepositoryImpl";
import {OpponentFieldCardAttributeMarkSceneRepositoryImpl} from "../../opponent_field_card_attribute_mark_scene/repository/OpponentFieldCardAttributeMarkSceneRepositoryImpl";
import {OpponentFieldCardAttributeMarkRepositoryImpl} from "../../opponent_field_card_attribute_mark/repository/OpponentFieldCardAttributeMarkRepositoryImpl";
import {OpponentFieldCardAttributeMark} from "../../opponent_field_card_attribute_mark/entity/OpponentFieldCardAttributeMark";
import {OpponentFieldCardAttributeMarkPosition} from "../../opponent_field_card_attribute_mark_position/entity/OpponentFieldCardAttributeMarkPosition";
import {OpponentFieldCardAttributeMarkScene} from "../../opponent_field_card_attribute_mark_scene/entity/OpponentFieldCardAttributeMarkScene";
import {OpponentFieldCardAttributeMarkStatus} from "../../opponent_field_card_attribute_mark/entity/OpponentFieldCardAttributeMarkStatus";
import {MarkSceneType} from "../../opponent_field_card_attribute_mark_scene/entity/MarkSceneType";

export class OpponentFieldServiceImpl implements OpponentFieldService {
    private static instance: OpponentFieldServiceImpl;

    private opponentFieldCardPositionRepository: OpponentFieldCardPositionRepository
    private opponentFieldCardSceneRepository: OpponentFieldCardSceneRepository
    private opponentFieldRepository: OpponentFieldRepository

    private opponentFieldCardAttributeMarkPositionRepository: OpponentFieldCardAttributeMarkPositionRepository
    private opponentFieldCardAttributeMarkSceneRepository: OpponentFieldCardAttributeMarkSceneRepository
    private opponentFieldCardAttributeMarkRepository: OpponentFieldCardAttributeMarkRepository

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
        this.opponentFieldRepository = OpponentFieldRepositoryImpl.getInstance()

        this.opponentFieldCardAttributeMarkPositionRepository = OpponentFieldCardAttributeMarkPositionRepositoryImpl.getInstance()
        this.opponentFieldCardAttributeMarkSceneRepository = OpponentFieldCardAttributeMarkSceneRepositoryImpl.getInstance()
        this.opponentFieldCardAttributeMarkRepository = OpponentFieldCardAttributeMarkRepositoryImpl.getInstance()
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

        try {
            const textures = await this.loadCardTextures(card);
            await this.addAttributesToCardGroup(mainCardScene, createdOpponentFieldPosition, card, cardGroup, opponentFieldPosition, textures);
        } catch (error) {
            console.error("Error loading textures:", error);
        }

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

    private async loadCardTextures(card: any): Promise<(THREE.Texture | null)[]> {
        const unitJob = parseInt(card.병종, 10) as CardJob;
        const cardKind = parseInt(card.종류, 10) as CardKind;

        // 공통 텍스처 로드
        const commonTextures = await Promise.all([
            this.textureManager.getTexture('race', card.종족),
            this.textureManager.getTexture('hp', card.체력),
            this.textureManager.getTexture('energy', 0),
        ]);

        // CardKind.UNIT인 경우, 직업에 따라 무기 텍스처를 로드
        let specificTextures: Promise<THREE.Texture | null>[] = [];
        if (cardKind === CardKind.UNIT) {
            const weaponTextureName = OpponentFieldServiceImpl.weaponTextureMap[unitJob as CardJob] || 'default_weapon';
            specificTextures.push(
                this.textureManager.getTexture(weaponTextureName, card.공격력).then(texture => texture ?? null)
            );
        } else {
            specificTextures.push(
                this.textureManager.getTexture('card_kinds', card.종류).then(texture => texture ?? null)
            );
        }

        const textures = await Promise.all([...specificTextures, ...commonTextures]);

        return textures.map(texture => texture ?? null);
    }

    private async addAttributesToCardGroup(
        mainCardScene: OpponentFieldCardScene,
        createdHandPosition: OpponentFieldCardPosition,
        card: Card,
        cardGroup: THREE.Group,
        handPosition: Vector2d,
        textures: (Texture | null)[]
    ): Promise<void> {
        const unitJob = parseInt(card.병종, 10) as CardJob;
        const cardKind = parseInt(card.종류, 10) as CardKind;
        const cardId = card.카드번호;

        const [kindsOrWeaponTexture, raceTexture, hpTexture, energyTexture] = textures;
        const attributeMarks: OpponentFieldCardAttributeMark[] = [];

        if (cardKind === CardKind.UNIT && unitJob === CardJob.WARRIOR && kindsOrWeaponTexture) {
            const weaponPosition = this.calculateWeaponPosition(handPosition);
            const weaponMesh = this.createWeaponMesh(kindsOrWeaponTexture, weaponPosition);
            cardGroup.add(weaponMesh);

            const weaponMark = await this.saveCardAttributeMark(weaponMesh, weaponPosition, MarkSceneType.SWORD);
            attributeMarks.push(weaponMark)
        }

        if (cardKind === CardKind.UNIT && unitJob === CardJob.MAGICIAN && kindsOrWeaponTexture) {
            const staffPosition = this.calculateStaffPosition(handPosition);
            const staffMesh = this.createStaffMesh(kindsOrWeaponTexture, staffPosition);
            cardGroup.add(staffMesh);

            const staffMark = await this.saveCardAttributeMark(staffMesh, staffPosition, MarkSceneType.STAFF);
            attributeMarks.push(staffMark)
        }

        if (cardKind !== CardKind.UNIT && kindsOrWeaponTexture) {
            const kindsPosition = this.calculateKindsPosition(handPosition);
            const kinsMesh = this.createKindsMesh(kindsOrWeaponTexture, kindsPosition);
            cardGroup.add(kinsMesh);

            const kindsMark = await this.saveCardAttributeMark(kinsMesh, kindsPosition, MarkSceneType.KINDS);
            attributeMarks.push(kindsMark)
        }

        if (raceTexture) {
            const racePosition = this.calculateRacePosition(handPosition)
            const raceMesh = this.createRaceMesh(raceTexture, racePosition);
            cardGroup.add(raceMesh);

            const raceMark = await this.saveCardAttributeMark(raceMesh, racePosition, MarkSceneType.RACE);
            attributeMarks.push(raceMark)
        }

        if (hpTexture) {
            const hpPosition = this.calculateHpPosition(handPosition)
            const hpMesh = this.createHpMesh(hpTexture, hpPosition);
            cardGroup.add(hpMesh);

            const hpMark = await this.saveCardAttributeMark(hpMesh, hpPosition, MarkSceneType.HP);
            attributeMarks.push(hpMark)
        }

        if (cardKind === CardKind.UNIT && energyTexture) {
            const energyPosition = this.calculateEnergyPosition(handPosition)
            const energyMesh = this.createEnergyMesh(energyTexture, energyPosition);
            cardGroup.add(energyMesh);

            const energyMark = await this.saveCardAttributeMark(energyMesh, energyPosition, MarkSceneType.ENERGY);
            attributeMarks.push(energyMark)
        }

        const attributeMarkIdList = attributeMarks.map((mark) => mark.getId())
        this.opponentFieldRepository.save(mainCardScene.getId(), createdHandPosition.getId(), attributeMarkIdList, cardId)
    }

    private calculateWeaponPosition(handPosition: Vector2d): Vector2d {
        const x = handPosition.getX() + this.CARD_WIDTH * 0.44 * window.innerWidth;
        const y = handPosition.getY() - this.CARD_HEIGHT * 0.45666 * window.innerWidth;
        return new Vector2d(x, y);
    }

    private createWeaponMesh(texture: THREE.Texture, position: Vector2d): THREE.Mesh {
        return MeshGenerator.createMesh(
            texture,
            this.CARD_WIDTH * 0.63 * window.innerWidth,
            this.CARD_WIDTH * 0.63 * 1.651 * window.innerWidth,
            position
        );
    }

    private calculateStaffPosition(handPosition: Vector2d): Vector2d {
        const x = handPosition.getX() + this.CARD_WIDTH * 0.54 * window.innerWidth;
        const y = handPosition.getY() - this.CARD_HEIGHT * 0.30666 * window.innerWidth;
        return new Vector2d(x, y);
    }

    private createStaffMesh(texture: THREE.Texture, position: Vector2d): THREE.Mesh {
        return MeshGenerator.createMesh(
            texture,
            this.CARD_WIDTH * 0.63 * window.innerWidth,
            this.CARD_WIDTH * 0.63 * 1.9353 * window.innerWidth,
            position
        );
    }

    private calculateKindsPosition(handPosition: Vector2d): Vector2d {
        const x = handPosition.getX() + this.CARD_WIDTH * 0.5 * window.innerWidth;
        const y = handPosition.getY() - this.CARD_HEIGHT * 0.5 * window.innerWidth;
        return new Vector2d(x, y);
    }

    private createKindsMesh(texture: THREE.Texture, position: Vector2d): THREE.Mesh {
        return MeshGenerator.createMesh(
            texture,
            this.CARD_WIDTH * 0.4 * window.innerWidth,
            this.CARD_WIDTH * 0.4 * window.innerWidth,
            position
        );
    }

    private calculateRacePosition(handPosition: Vector2d): Vector2d {
        const x = handPosition.getX() + this.CARD_WIDTH * 0.5 * window.innerWidth;
        const y = handPosition.getY() + this.CARD_HEIGHT * 0.5 * window.innerWidth;
        return new Vector2d(x, y);
    }

    private createRaceMesh(texture: THREE.Texture, position: Vector2d): THREE.Mesh {
        return MeshGenerator.createMesh(
            texture,
            this.CARD_WIDTH * 0.4 * window.innerWidth,
            this.CARD_WIDTH * 0.4 * window.innerWidth,
            position
        );
    }

    private calculateHpPosition(handPosition: Vector2d): Vector2d {
        const x = handPosition.getX() - this.CARD_WIDTH * 0.5 * window.innerWidth;
        const y = handPosition.getY() - this.CARD_HEIGHT * 0.43438 * window.innerWidth;
        return new Vector2d(x, y);
    }

    private createHpMesh(texture: THREE.Texture, position: Vector2d): THREE.Mesh {
        return MeshGenerator.createMesh(
            texture,
            this.CARD_WIDTH * 0.31 * window.innerWidth,
            this.CARD_WIDTH * 0.31 * 1.65454 * window.innerWidth,
            position
        );
    }

    private calculateEnergyPosition(handPosition: Vector2d): Vector2d {
        const x = handPosition.getX() - this.CARD_WIDTH * 0.5 * window.innerWidth;
        const y = handPosition.getY() + this.CARD_HEIGHT * 0.5 * window.innerWidth;
        return new Vector2d(x, y);
    }

    private createEnergyMesh(texture: THREE.Texture, position: Vector2d): THREE.Mesh {
        return MeshGenerator.createMesh(
            texture,
            this.CARD_WIDTH * 0.39 * window.innerWidth,
            this.CARD_WIDTH * 0.39 * 1.344907 * window.innerWidth,
            position
        );
    }

    private async saveCardAttributeMark(mesh: THREE.Mesh, position: Vector2d, markSceneType: MarkSceneType): Promise<OpponentFieldCardAttributeMark> {
        const attributeMarkPosition = new OpponentFieldCardAttributeMarkPosition(position.getX(), position.getY());
        await this.opponentFieldCardAttributeMarkPositionRepository.save(attributeMarkPosition);

        const attributeMarkScene = new OpponentFieldCardAttributeMarkScene(mesh, markSceneType);
        await this.opponentFieldCardAttributeMarkSceneRepository.save(attributeMarkScene);

        const attributeMark = new OpponentFieldCardAttributeMark(
            OpponentFieldCardAttributeMarkStatus.HAND,
            attributeMarkScene.getId(),
            attributeMarkPosition.getId()
        );
        return await this.opponentFieldCardAttributeMarkRepository.save(attributeMark);
    }
}