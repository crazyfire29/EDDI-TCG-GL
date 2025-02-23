import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {SelectedCardBlockHoverDetectService} from "./SelectedCardBlockHoverDetectService";
import {SelectedCardBlockHoverDetectRepositoryImpl} from "../repository/SelectedCardBlockHoverDetectRepositoryImpl";
import {SelectedCardBlock} from "../../selected_card_block/entity/SelectedCardBlock";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

import {SelectedCardBlockStateManager} from "../../selected_card_block_manager/SelectedCardBlockStateManager";

export class SelectedCardBlockHoverDetectServiceImpl implements SelectedCardBlockHoverDetectService {
    private static instance: SelectedCardBlockHoverDetectServiceImpl | null = null;
    private selectedCardBlockHoverDetectRepository: SelectedCardBlockHoverDetectRepositoryImpl;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;
    private cameraRepository: CameraRepository;
    private selectedCardBlockStataManager: SelectedCardBlockStateManager;
    private mouseOver: boolean = false;


    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.selectedCardBlockHoverDetectRepository = SelectedCardBlockHoverDetectRepositoryImpl.getInstance();
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.selectedCardBlockStataManager = SelectedCardBlockStateManager.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): SelectedCardBlockHoverDetectServiceImpl {
        if (!SelectedCardBlockHoverDetectServiceImpl.instance) {
            SelectedCardBlockHoverDetectServiceImpl.instance = new SelectedCardBlockHoverDetectServiceImpl(camera, scene);
        }
        return SelectedCardBlockHoverDetectServiceImpl.instance;
    }

    setMouseOver(state: boolean): void {
        this.mouseOver = state;
    }

    isMouseOver(): boolean {
        return this.mouseOver;
    }

    public async handleMouseOver(hoverPoint: { x: number; y: number }): Promise<SelectedCardBlock | null> {
        const { x, y } = hoverPoint;
        const blockList = await this.getAllBlocks();
        const hoveredBlock = this.selectedCardBlockHoverDetectRepository.isBlockHover(
            { x, y },
            blockList,
            this.camera
        );

        if (hoveredBlock) {
            const blockId = hoveredBlock.id;
            console.log(`[DEBUG] Hovered Block ID: ${blockId}`);
            this.saveCurrentHoveredBlockId(blockId);

            const currentHoveredBlockId = this.getCurrentHoveredBlockId();
            const hiddenBlock = blockList.find(
                (block) => this.getBlockVisibility(block.id) == false
            );

            if (hiddenBlock && hiddenBlock.id !== currentHoveredBlockId) {
                this.setBlockVisibility(hiddenBlock.id, true);
            }

            if (currentHoveredBlockId !== null) {
                this.setBlockVisibility(currentHoveredBlockId, false);
            }

            return hoveredBlock;

        } else {
            const allHiddenBlockIds = this.getHiddenBlockIds();
            allHiddenBlockIds.forEach((blockId) => this.setBlockVisibility(blockId, true));
        }
        return null;
    }

//     public async handleMouseOut(hoverPoint: { x: number; y: number }): Promise<SelectedCardBlock | null> {
//         const { x, y } = hoverPoint;
//         const blockList = await this.getAllBlocks();
//         const hoveredBlock = this.selectedCardBlockHoverDetectRepository.isBlockHover(
//             { x, y },
//             blockList,
//             this.camera
//         );
//
//         console.log(`[DEBUG] Mouse Out 시 Hovered Block:`, hoveredBlock);
//
//         const currentHoveredBlockId = this.getCurrentHoveredBlockId();
//         if (hoveredBlock && currentHoveredBlockId !== null) {
//             console.log(`[DEBUG] Mouse Out from Block ID: ${hoveredBlock.id}`);
//             this.setBlockVisibility(currentHoveredBlockId, true);
//             this.initialCurrentHoveredBlockId();
//
//             return hoveredBlock;
//         }
//         return null;
//     }

    public async onMouseOver(event: MouseEvent): Promise<SelectedCardBlock | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleMouseOver(hoverPoint);
        }
        return null;
    }

//     public async onMouseOut(event: MouseEvent): Promise<SelectedCardBlock | null> {
//         console.log('Mouse Out Event Triggered');
//         if (event.button === 0) {
//             const hoverPoint = { x: event.clientX, y: event.clientY };
//             return await this.handleMouseOut(hoverPoint);
//         }
//         return null;
//     }

    public getAllBlocks(): SelectedCardBlock[] {
        return this.selectedCardBlockRepository.findAllBlocks();
    }

    public getCardIdByBlockUniqueId(blockUniqueId: number): number {
        return this.selectedCardBlockRepository.findCardIdByBlockUniqueId(blockUniqueId) ?? -1;
    }

    public saveCurrentHoveredBlockId(blockUniqueId: number): void {
        this.selectedCardBlockHoverDetectRepository.saveCurrentHoveredBlockId(blockUniqueId);
    }

    public getCurrentHoveredBlockId(): number | null {
        return this.selectedCardBlockHoverDetectRepository.findCurrentHoveredBlockId();
    }

    public initialCurrentHoveredBlockId(): void {
        this.selectedCardBlockHoverDetectRepository.initialCurrentHoveredBlockId();
    }

    private setBlockVisibility(blockId: number, isVisible: boolean): void {
        this.selectedCardBlockStataManager.setBlockVisibility(blockId, isVisible);
    }

    public getBlockVisibility(blockId: number): boolean {
        return this.selectedCardBlockStataManager.findBlockVisibility(blockId);
    }

    private getHiddenBlockIds(): number[] {
        return this.selectedCardBlockStataManager.findHiddenBlockIds();
    }
}
