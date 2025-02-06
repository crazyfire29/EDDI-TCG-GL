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

    private readonly BLOCK_WIDTH: number = 0.245
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

    public findAllBlocks(): SelectedCardBlock[] {
        return Array.from(this.blockMap.values()).map(({ blockMesh }) => blockMesh);
    }

    public findBlockIdList(): number[] {
        return Array.from(this.blockMap.keys());
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

    public deleteBlockByBlockId(blockId: number): void {
        this.blockMap.delete(blockId);

        // 기존 데이터를 배열로 변환 후 정렬된 새로운 Map 생성
        const newBlockMap = new Map<number, { cardId: number, blockMesh: SelectedCardBlock }>();
        let newBlockId = 0;

        for (const { cardId, blockMesh } of this.blockMap.values()) {
            newBlockMap.set(newBlockId++, { cardId, blockMesh });
        }

        this.blockMap = newBlockMap; // 새로운 맵으로 교체
    }

}
