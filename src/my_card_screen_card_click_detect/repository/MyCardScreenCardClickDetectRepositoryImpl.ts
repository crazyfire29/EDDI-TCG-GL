import * as THREE from "three";

import {MyCardScreenCardClickDetectRepository} from "./MyCardScreenCardClickDetectRepository";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";

export class MyCardScreenCardClickDetectRepositoryImpl implements MyCardScreenCardClickDetectRepository {
    private static instance: MyCardScreenCardClickDetectRepositoryImpl;
    private raycaster = new THREE.Raycaster();
    private currentClickCardId: number | null = null;

    public static getInstance(): MyCardScreenCardClickDetectRepositoryImpl {
        if (!MyCardScreenCardClickDetectRepositoryImpl.instance) {
            MyCardScreenCardClickDetectRepositoryImpl.instance = new MyCardScreenCardClickDetectRepositoryImpl();
        }
        return MyCardScreenCardClickDetectRepositoryImpl.instance;
    }

    public isMyCardScreenCardClicked(clickPoint: { x: number; y: number },
        cardList: MyCardScreenCard[],
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
                const hoveredCard = cardList.find(
                    card => card.getMesh() === intersectedMesh
                );

                if (hoveredCard) {
                    console.log('Detect Clicked Card')
                    return hoveredCard;
                }
            }
            return null;
        }

    public saveCurrentClickedCardId(id: number): void {
        this.currentClickCardId = id;
    }

    public findCurrentClickedCardId(): number | null {
        return this.currentClickCardId;
    }

}