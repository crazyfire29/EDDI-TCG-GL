import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";
import {SelectedCardBlockService} from "./SelectedCardBlockService";
import {SelectedCardBlock} from "../../selected_card_block/entity/SelectedCardBlock";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";
import {SelectedCardBlockPosition} from "../../selected_card_block_position/entity/SelectedCardBlockPosition";
import {SelectedCardBlockPositionRepositoryImpl} from "../../selected_card_block_position/repository/SelectedCardBlockPositionRepositoryImpl";

export class SelectedCardBlockServiceImpl implements SelectedCardBlockService {
    private static instance: SelectedCardBlockServiceImpl;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;
    private selectedCardBlockPositionRepository: SelectedCardBlockPositionRepositoryImpl;

    private constructor() {
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.selectedCardBlockPositionRepository = SelectedCardBlockPositionRepositoryImpl.getInstance();
    }

    public static getInstance(): SelectedCardBlockServiceImpl {
        if (!SelectedCardBlockServiceImpl.instance) {
            SelectedCardBlockServiceImpl.instance = new SelectedCardBlockServiceImpl();
        }
        return SelectedCardBlockServiceImpl.instance;
    }

    public async createSelectedCardBlockWithPosition(cardId: number): Promise<THREE.Group | null> {
        const cardGroup = new THREE.Group();

        try {
            const position = this.makeSelectedCardBlockPosition(cardId);
            console.log(`[DEBUG] Block Position X=${position.position.getX()}, Y=${position.position.getY()}`);

            const selectedCardBlock = await this.createSelectedCardBlock(cardId, position.position);
            cardGroup.add(selectedCardBlock.getMesh());

        } catch (error) {
            console.error(`[Error] Failed to create MyDeckCardScene: ${error}`);
            return null;
        }
        return cardGroup;
    }

    public adjustSelectedCardBlockPosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const blockIdList = this.getAllBlockIdList();
        for (const blockId of blockIdList) {
            const blockMesh = this.getBlockMeshByBlockId(blockId);
            if (!blockMesh) {
                console.warn(`[WARN] Block Mesh with block ID ${blockId} not found`);
                continue;
            }

            const initialPosition = this.getPositionByBlockId(blockId);
            if (!initialPosition) {
                console.error(`[DEBUG] (adjust) No position found for block id: ${blockId}`);
                continue;
            }
            console.log(`[DEBUG] (adjust) InitialPosition: ${initialPosition}`);

            const blockWidth = 0.235 * window.innerWidth;
            const blockHeight = 0.145 * window.innerHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;
            console.log(`[DEBUG] (adjust) Block ${blockId}:`, {
                initialPosition: initialPosition,
                newPositionX,
                newPositionY,
            });

            blockMesh.geometry.dispose();
            blockMesh.geometry = new THREE.PlaneGeometry(blockWidth, blockHeight);
            blockMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    private async createSelectedCardBlock(cardId: number, position: Vector2d): Promise<SelectedCardBlock> {
        return await this.selectedCardBlockRepository.createSelectedCardBlock(cardId, position);
    }

    private makeSelectedCardBlockPosition(cardId: number): SelectedCardBlockPosition {
        return this.selectedCardBlockPositionRepository.addSelectedCardBlockPosition(cardId);
    }

    public getBlockMeshByBlockId(blockId: number): THREE.Mesh | null {
        const block = this.selectedCardBlockRepository.findBlockByBlockId(blockId);
        if (!block) {
            console.warn(`[WARN] Block (ID: ${blockId}) not found`);
            return null;
        }
        const blockMesh = block.getMesh();
        return blockMesh;
    }

    public getAllBlockIdList(): number[] {
        return this.selectedCardBlockRepository.findBlockIdList();
    }

    public getPositionByBlockId(blockId: number): SelectedCardBlockPosition | undefined {
        return this.selectedCardBlockPositionRepository.findPositionById(blockId);
    }

}
