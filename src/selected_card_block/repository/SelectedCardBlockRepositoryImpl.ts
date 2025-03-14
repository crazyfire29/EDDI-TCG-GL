import * as THREE from 'three';
import {SelectedCardBlockRepository} from './SelectedCardBlockRepository';
import {SelectedCardBlock} from "../entity/SelectedCardBlock";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";
import {getCardById} from "../../card/utility";

export class SelectedCardBlockRepositoryImpl implements SelectedCardBlockRepository {
    private static instance: SelectedCardBlockRepositoryImpl;
    private blockMap: Map<number, { cardId: number, blockMesh: SelectedCardBlock }> = new Map(); // block unique id: {card id: block mesh}
    private textureManager: TextureManager;
    private blockGroup: THREE.Group | null = null;

    private readonly BLOCK_WIDTH: number = 0.235
    private readonly BLOCK_HEIGHT: number = 0.145

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): SelectedCardBlockRepositoryImpl {
        if (!SelectedCardBlockRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            SelectedCardBlockRepositoryImpl.instance = new SelectedCardBlockRepositoryImpl(textureManager);
        }
        return SelectedCardBlockRepositoryImpl.instance;
    }

    public async createSelectedCardBlock(cardId: number, position: Vector2d): Promise<SelectedCardBlock> {
        const texture = await this.textureManager.getTexture('selected_card_block', cardId);
        if (!texture) {
            throw new Error(`Texture for Selected Card Block ${cardId} not found`);
        }

        const blockWidth = this.BLOCK_WIDTH * window.innerWidth;
        const blockHeight = this.BLOCK_HEIGHT * window.innerHeight;

        const blockPositionX = position.getX() * window.innerWidth;
        const blockPositionY = position.getY() * window.innerHeight;

        const blockMesh = MeshGenerator.createMesh(texture, blockWidth, blockHeight, position);
        blockMesh.position.set(blockPositionX, blockPositionY, 0);

        const newBlock = new SelectedCardBlock(blockMesh, position);
        this.blockMap.set(newBlock.id, { cardId, blockMesh: newBlock });

        return newBlock;
    }

    public findBlockByBlockId(blockId: number): SelectedCardBlock | null {
        const block = this.blockMap.get(blockId);
        if (block) {
            return block.blockMesh;
        } else {
            return null;
        }
    }

    public findBlockByCardId(cardId: number): SelectedCardBlock | null {
        for (const { cardId: storedCardId, blockMesh } of this.blockMap.values()) {
            if (storedCardId === cardId) {
                return blockMesh;
            }
        }
        return null;
    }

    public findBlockIdByCardId(cardId: number): number | null {
        for (const [blockId, { cardId: storedCardId }] of this.blockMap.entries()) {
            if (storedCardId === cardId) {
                console.log(`Match found! Returning blockId: ${blockId}`);
                return blockId;
            }
        }
        return null;
    }

    public findAllBlocks(): SelectedCardBlock[] {
        return Array.from(this.blockMap.values()).map(({ blockMesh }) => blockMesh);
    }

    public findBlockIdList(): number[] {
        return Array.from(this.blockMap.keys());
    }

    public findBlockCardIdList(): number[] {
        return Array.from(this.blockMap.values()).map(({ cardId }) => cardId);
    }

    public findCardIdByBlockUniqueId(blockUniqueId: number): number | null {
        const block = this.blockMap.get(blockUniqueId);
        if (block) {
            return block.cardId;
        } else {
            return null;
        }
    }

    public containsCardIdInMap(cardId: number): boolean {
        for (const { cardId: storedCardId } of this.blockMap.values()) {
            if (storedCardId === cardId) {
                return true;
            }
        }
        return false;
    }

    public deleteAllBlock(): void {
        this.blockMap.clear();
    }


    // 버튼은 생성될 때마다 고유 아이디가 자동으로 부여되기 때문에 재정렬 필요x
    public deleteBlockByBlockId(blockId: number): void {
        this.blockMap.delete(blockId);
    }

    public hideBlock(cardId: number): void {
        const block = this.findBlockByCardId(cardId);
        if (block) {
            block.getMesh().visible = false;
        }
    }

    public showBlock(cardId: number): void {
        const block = this.findBlockByCardId(cardId);
        if (block) {
            block.getMesh().visible = true;
        }
    }

    public findAllBlockGroups(): THREE.Group {
        if (!this.blockGroup) {
            this.blockGroup = new THREE.Group();
            for (const { blockMesh } of this.blockMap.values()) {
                this.blockGroup.add(blockMesh.getMesh());
            }
        }
        return this.blockGroup;
    }

    public blockCount(): number {
        console.log(`Current Block Count? ${this.blockMap.size}`);
        return this.blockMap.size;
    }

}
