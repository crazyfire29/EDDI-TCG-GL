import * as THREE from "three";

import {MyCardScreenCardHoverDetectRepository} from "./MyCardScreenCardHoverDetectRepository";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";

export class MyCardScreenCardHoverDetectRepositoryImpl implements MyCardScreenCardHoverDetectRepository {
    private static instance: MyCardScreenCardHoverDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentHoverCardId: number | null = null;

    public static getInstance(): MyCardScreenCardHoverDetectRepositoryImpl {
        if (!MyCardScreenCardHoverDetectRepositoryImpl.instance) {
            MyCardScreenCardHoverDetectRepositoryImpl.instance = new MyCardScreenCardHoverDetectRepositoryImpl();
        }
        return MyCardScreenCardHoverDetectRepositoryImpl.instance;
    }

    public isMyCardScreenCardHover(hoverPoint: { x: number; y: number },
        cardList: MyCardScreenCard[],
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