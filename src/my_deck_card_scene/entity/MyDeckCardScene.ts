import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class MyDeckCardScene {
    id: number;
    deckId: number;
    uniqueCardIds: number[]; // 중복 제거한 카드 id 리스트
    positionIdList: number[];
    cardCountMap: Map<number, number> = new Map(); //각 카드의 갯수
    meshes: THREE.Group;

    constructor(deckId: number, cardIdList: number[], positionIdList: number[], meshes?: THREE.Group) {
        this.id = IdGenerator.generateId("MyDeckCardScene");
        this.deckId = deckId;
        this.uniqueCardIds = Array.from(new Set(cardIdList));
        this.positionIdList = positionIdList;
        this.cardCountMap = this.generateCardCountMap(cardIdList);
        this.meshes = meshes || new THREE.Group();
    }

    private generateCardCountMap(cardIdList: number[]): Map<number, number> {
        const cardCountMap = new Map<number, number>();
        cardIdList.forEach(cardId => {
            const currentCount = cardCountMap.get(cardId) || 0;
            cardCountMap.set(cardId, currentCount + 1);
        });
        return cardCountMap;
    }

    addMesh(mesh: THREE.Mesh): void {
        this.meshes.add(mesh);
    }

    addMeshes(cardGroup: THREE.Group): void {
        console.log(`[DEBUG] card group children length?: ${cardGroup.children.length}`);
        this.meshes = cardGroup;
        console.log(`[DEBUG] Meshes Length?: ${this.meshes.children.length}`);
    }

    removeMesh(mesh: THREE.Mesh): boolean {
        if (this.meshes.children.includes(mesh)) {
            this.meshes.remove(mesh);
            return true;
        }
        return false;
    }

    getMeshes(): THREE.Group {
        return this.meshes;
    }

    getId(): number {
        return this.id;
    }

    getDeckId(): number {
        return this.deckId;
    }

    getPositionIdList(): number[] {
        return this.positionIdList;
    }

    getUniqueCardIds(): number[] {
        return this.uniqueCardIds;
    }

    getCardCount(cardId: number): number {
        return this.cardCountMap.get(cardId) || 0;
    }

}
