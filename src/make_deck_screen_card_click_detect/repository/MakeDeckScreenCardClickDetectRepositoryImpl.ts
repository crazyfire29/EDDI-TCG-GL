import * as THREE from "three";

import {MakeDeckScreenCardClickDetectRepository} from "./MakeDeckScreenCardClickDetectRepository";
import {MakeDeckScreenCard} from "../../make_deck_screen_card/entity/MakeDeckScreenCard";

export class MakeDeckScreenCardClickDetectRepositoryImpl implements MakeDeckScreenCardClickDetectRepository {
    private static instance: MakeDeckScreenCardClickDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();

    public static getInstance(): MakeDeckScreenCardClickDetectRepositoryImpl {
        if (!MakeDeckScreenCardClickDetectRepositoryImpl.instance) {
            MakeDeckScreenCardClickDetectRepositoryImpl.instance = new MakeDeckScreenCardClickDetectRepositoryImpl();
        }
        return MakeDeckScreenCardClickDetectRepositoryImpl.instance;
    }

    public isMakeDeckScreenCardClicked(clickPoint: { x: number; y: number },
        cardList: MakeDeckScreenCard[],
        camera: THREE.Camera): any | null {
            const { x, y } = clickPoint;

            const normalizedMouse = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );

            this.raycaster.setFromCamera(normalizedMouse, camera);

            const meshes = cardList.map(card => card.getMesh());
            const intersects = this.raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const intersectedMesh = intersects[0].object;
                const clickedCard = cardList.find(
                    card => card.getMesh() === intersectedMesh
                );

                if (clickedCard) {
                    console.log('Detect Clicked Card!')
                    return clickedCard;
                }
            }

            return null;
        }

}