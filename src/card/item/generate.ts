import * as THREE from "three";
import { Vector2d } from "../../common/math/Vector2d";
import { TextureManager } from "../../texture_manager/TextureManager";
import { MeshGenerator } from "../../mesh/generator";

interface CardInitialInfo {
    cardMesh: THREE.Mesh;
    initialPosition: Vector2d;
    textureId: string;
    width: number;
    height: number;
    cardIndex: number;
}

export class ItemCardGenerator {
    private static cardInitialInfoMap: Map<string, CardInitialInfo> = new Map();
    private static resizeHandler: (() => void) | null = null;

    static async createItemCard(card: any, position: Vector2d = new Vector2d(0, 0), indexCount: number = 0): Promise<THREE.Group> {
        const textureManager = TextureManager.getInstance();

        const cardTexture = await textureManager.getTexture('card', card.카드번호);
        const cardGroup = new THREE.Group();

        if (!cardTexture) {
            throw new Error('Card texture not found');
        }

        const cardWidth = 0.064935 * window.innerWidth;
        const cardHeight = cardWidth * 1.615;

        const mainCardMesh = MeshGenerator.createMesh(cardTexture, cardWidth, cardHeight, position);
        cardGroup.add(mainCardMesh);

        this.saveInitialPosition(mainCardMesh, position, cardWidth, cardHeight, 'mainCardTextureId', indexCount);

        await this.addOptionalItemTextures(card, cardGroup, cardWidth, cardHeight, position, indexCount);

        this.registerResizeHandler();

        return cardGroup;
    }

    private static async addOptionalItemTextures(
        card: any,
        group: THREE.Group,
        cardWidth: number,
        cardHeight: number,
        position: Vector2d,
        indexCount: number
    ) {
        const textureManager = TextureManager.getInstance();

        const supportTextures = await Promise.all([
            textureManager.getTexture('card_kinds', card.종류),
            textureManager.getTexture('race', card.종족),
        ]);

        const [cardKindsTexture, cardRaceTexture] = supportTextures;

        if (cardKindsTexture) {
            const kindsWidth = cardWidth * 0.4;
            const kindsHeight = kindsWidth;

            const kindsPosition = new Vector2d(position.getX() + cardWidth * 0.5, position.getY() - cardHeight * 0.5);
            this.addTextureToGroup(group, cardKindsTexture, kindsWidth, kindsHeight, kindsPosition, 'kindsTextureId', indexCount);
        }

        if (cardRaceTexture) {
            const raceWidth = cardWidth * 0.4;
            const raceHeight = raceWidth;

            const racePosition = new Vector2d(position.getX() + cardWidth * 0.5, position.getY() + cardHeight * 0.5);
            this.addTextureToGroup(group, cardRaceTexture, raceWidth, raceHeight, racePosition, 'raceTextureId', indexCount);
        }
    }

    private static addTextureToGroup(group: THREE.Group, texture: THREE.Texture, width: number, height: number, position: Vector2d, textureId: string, indexCount: number) {
        const mesh = MeshGenerator.createMesh(texture, width, height, position);
        mesh.userData.textureId = textureId;
        group.add(mesh);
        this.saveInitialPosition(mesh, position, width, height, textureId, indexCount);
    }

    private static saveInitialPosition(mesh: THREE.Mesh, position: Vector2d, width: number, height: number, textureId: string, indexCount: number) {
        this.cardInitialInfoMap.set(mesh.uuid, {
            cardMesh: mesh,
            initialPosition: position.clone(),
            width,
            height,
            textureId,
            cardIndex: indexCount
        });
    }

    private static registerResizeHandler(): void {
        if (!this.resizeHandler) {
            this.resizeHandler = () => {
                this.adjustCardPositions();
            };
            window.addEventListener("resize", this.resizeHandler);
        }
    }

    static adjustCardPositions(): void {
        this.cardInitialInfoMap.forEach(({ cardMesh, initialPosition, textureId, cardIndex }) => {
            const cardWidth = 0.064935 * window.innerWidth;
            const cardHeight = cardWidth * 1.615;

            const mainCardPositionX = (0.311904 - 0.5 + cardIndex * 0.094696) * window.innerWidth;
            const mainCardPositionY = (0.5 - 0.972107) * window.innerHeight + (cardHeight * 0.5);

            if (textureId === "mainCardTextureId") {
                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
                cardMesh.position.set(mainCardPositionX, mainCardPositionY, 0);
            } else if (textureId === "kindsTextureId") {
                const kindsWidth = cardWidth * 0.4;
                const kindsHeight = kindsWidth;
                const kindsPositionX = mainCardPositionX + cardWidth * 0.5;
                const kindsPositionY = mainCardPositionY - cardHeight * 0.5;

                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(kindsWidth, kindsHeight);
                cardMesh.position.set(kindsPositionX, kindsPositionY, 0);
            } else if (textureId === "raceTextureId") {
                const raceWidth = cardWidth * 0.4;
                const raceHeight = raceWidth;
                const racePositionX = mainCardPositionX + cardWidth * 0.5;
                const racePositionY = mainCardPositionY + cardHeight * 0.5;

                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(raceWidth, raceHeight);
                cardMesh.position.set(racePositionX, racePositionY, 0);
            }
        });
    }
}
