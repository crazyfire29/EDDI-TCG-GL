import * as THREE from "three";

import {MakeDeckScreenCardHoverDetectRepository} from "./MakeDeckScreenCardHoverDetectRepository";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";

export class MakeDeckScreenCardHoverDetectRepositoryImpl implements MakeDeckScreenCardHoverDetectRepository {
    private static instance: MakeDeckScreenCardHoverDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentHoverCardId: number | null = null;

    public static getInstance(): MakeDeckScreenCardHoverDetectRepositoryImpl {
        if (!MakeDeckScreenCardHoverDetectRepositoryImpl.instance) {
            MakeDeckScreenCardHoverDetectRepositoryImpl.instance = new MakeDeckScreenCardHoverDetectRepositoryImpl();
        }
        return MakeDeckScreenCardHoverDetectRepositoryImpl.instance;
    }

    public isMakeDeckScreenCardHover(hoverPoint: { x: number; y: number },
        cardList: MakeDeckScreenCard[],
        camera: THREE.Camera): any | null {
            const { x, y } = hoverPoint;

            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const meshes = cardList.map(card => card.getMesh());
            const intersects = this.raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const hoveredCard = cardList.find(
                    card => card.getMesh() === intersectedMesh
                );

                if (hoveredCard) {
                    console.log('Detect Hovered Card!')
                    return hoveredCard;
                }
            }
            return null;
        }

    public saveCurrentHoveredCardId(id: number): void {
        this.currentHoverCardId = id;
    }

    public findCurrentHoveredCardId(): number | null {
        return this.currentHoverCardId;
    }

}