import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {SelectedCardBlockHoverDetectService} from "./SelectedCardBlockHoverDetectService";
import {SelectedCardBlockHoverDetectRepositoryImpl} from "../repository/SelectedCardBlockHoverDetectRepositoryImpl";
import {SelectedCardBlock} from "../../selected_card_block/entity/SelectedCardBlock";
import {SelectedCardBlockRepositoryImpl} from "../../selected_card_block/repository/SelectedCardBlockRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class SelectedCardBlockHoverDetectServiceImpl implements SelectedCardBlockHoverDetectService {
    private static instance: SelectedCardBlockHoverDetectServiceImpl | null = null;
    private selectedCardBlockHoverDetectRepository: SelectedCardBlockHoverDetectRepositoryImpl;
    private selectedCardBlockRepository: SelectedCardBlockRepositoryImpl;
    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.selectedCardBlockHoverDetectRepository = SelectedCardBlockHoverDetectRepositoryImpl.getInstance();
        this.selectedCardBlockRepository = SelectedCardBlockRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): SelectedCardBlockHoverDetectServiceImpl {
        if (!SelectedCardBlockHoverDetectServiceImpl.instance) {
            SelectedCardBlockHoverDetectServiceImpl.instance = new SelectedCardBlockHoverDetectServiceImpl(camera, scene);
        }
        return SelectedCardBlockHoverDetectServiceImpl.instance;
    }

    setLeftMouseDown(state: boolean): void {
        this.leftMouseDown = state;
    }

    isLeftMouseDown(): boolean {
        return this.leftMouseDown;
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

            return hoveredBlock;
        }
        return null;
    }

    public async handleMouseOut(hoverPoint: { x: number; y: number }): Promise<SelectedCardBlock | null> {
        const { x, y } = hoverPoint;
        const blockList = await this.getAllBlocks();
        const hoveredBlock = this.selectedCardBlockHoverDetectRepository.isBlockHover(
            { x, y },
            blockList,
            this.camera
        );

        const currentHoveredBlockId = this.getCurrentHoveredBlockId();
        if (hoveredBlock && currentHoveredBlockId !== null) {
            console.log(`[DEBUG] Mouse Out from Block ID: ${hoveredBlock.id}`);
            this.initialCurrentHoveredBlockId();

            return hoveredBlock;
        }
        return null;
    }

    public async onMouseOver(event: MouseEvent): Promise<SelectedCardBlock | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleMouseOver(hoverPoint);
        }
        return null;
    }

    public async onMouseOut(event: MouseEvent): Promise<SelectedCardBlock | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleMouseOut(hoverPoint);
        }
        return null;
    }

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

}
