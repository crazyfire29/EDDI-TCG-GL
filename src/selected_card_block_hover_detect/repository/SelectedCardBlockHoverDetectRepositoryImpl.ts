import * as THREE from "three";

import {SelectedCardBlockHoverDetectRepository} from "./SelectedCardBlockHoverDetectRepository";
import {SelectedCardBlock} from "../../selected_card_block/entity/SelectedCardBlock";

export class SelectedCardBlockHoverDetectRepositoryImpl implements SelectedCardBlockHoverDetectRepository {
    private static instance: SelectedCardBlockHoverDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentHoveredBlockId: number | null = null;

    public static getInstance(): SelectedCardBlockHoverDetectRepositoryImpl {
        if (!SelectedCardBlockHoverDetectRepositoryImpl.instance) {
            SelectedCardBlockHoverDetectRepositoryImpl.instance = new SelectedCardBlockHoverDetectRepositoryImpl();
        }
        return SelectedCardBlockHoverDetectRepositoryImpl.instance;
    }

    public isBlockHover(hoverPoint: { x: number; y: number },
        blockList: SelectedCardBlock[],
        camera: THREE.Camera): SelectedCardBlock | null {
            const { x, y } = hoverPoint;

            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const meshes = blockList.map(block => block.getMesh());
            const intersects = this.raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const hoveredBlock = blockList.find(
                    block => block.getMesh() === intersectedMesh
                );

                if (hoveredBlock) {
                    console.log('Detect Hovered Block!')
                    return hoveredBlock;
                }
            }

            return null;
        }

    public saveCurrentHoveredBlockId(id: number): void {
        this.currentHoveredBlockId = id;
    }

    public findCurrentHoveredBlockId(): number | null {
        return this.currentHoveredBlockId;
    }

    public initialCurrentHoveredBlockId(): void {
        this.currentHoveredBlockId = null;
    }

}