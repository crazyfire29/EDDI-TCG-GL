import * as THREE from "three";
import { Vector2d } from "../../common/math/Vector2d";
import { TextureManager } from "../../texture_manager/TextureManager";
import { MeshGenerator } from "../../mesh/generator";

export class SupportCardGenerator {
    static async createSupportCard(card: any): Promise<THREE.Group> {
        const textureManager = TextureManager.getInstance();

        // 카드 ID와 관련된 텍스처를 로드
        const cardTexture = await textureManager.getTexture('card', card.카드번호);
        const cardKindsTexture = await textureManager.getTexture('card_kinds', card.종류);
        const cardRaceTexture = await textureManager.getTexture('race', card.종족);

        // 텍스처가 없을 경우 기본 텍스처를 생성하거나 오류를 발생시킵니다.
        if (!cardTexture) {
            throw new Error('Card texture not found');
        }
        if (!cardKindsTexture) {
            console.warn('Card kinds texture not found');
        }
        if (!cardRaceTexture) {
            console.warn('Card race texture not found');
        }

        const cardPosition = new Vector2d(-2, 0);
        const cardWidth = 2;
        const cardHeight = 3;

        // 메인 카드 메쉬 생성
        const mainCardMesh = MeshGenerator.createMesh(cardTexture, cardWidth, cardHeight, cardPosition);

        // 그룹을 생성하고 메인 카드 메쉬를 추가
        const group = new THREE.Group();
        group.add(mainCardMesh);

        // 카드 종류 메쉬가 있는 경우 추가
        if (cardKindsTexture) {
            const kindsPosition = new Vector2d(cardPosition.getX() + 1.0, cardPosition.getY() - 1.5);
            const kindsMesh = MeshGenerator.createMesh(cardKindsTexture, 1, 1, kindsPosition);
            group.add(kindsMesh);
        }

        // 카드 종족 메쉬가 있는 경우 추가
        if (cardRaceTexture) {
            const racePosition = new Vector2d(cardPosition.getX() + 1.0, cardPosition.getY() + 1.5);
            const raceMesh = MeshGenerator.createMesh(cardRaceTexture, 1, 1, racePosition);
            group.add(raceMesh);
        }

        return group;
    }
}
