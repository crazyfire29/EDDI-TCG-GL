import * as THREE from "three";
import { Vector2d } from "../../common/math/Vector2d";
import { TextureManager } from "../../texture_manager/TextureManager";
import { MeshGenerator } from "../../mesh/generator";
import { CardJob } from "../job";
import { UserWindowSize } from "../../window_size/WindowSize";

interface CardInitialInfo {
    cardMesh: THREE.Mesh;
    initialPosition: Vector2d;
    textureId: string;
    width: number;
    height: number;
    cardIndex: number;
}

export class UnitCardGenerator {
    private static cardInitialInfoMap: Map<string, CardInitialInfo> = new Map();
    private static resizeHandler: (() => void) | null = null;

    static async createUnitCard(card: any, position: Vector2d = new Vector2d(0, 0), indexCount: number = 0): Promise<THREE.Group> {
        const textureManager = TextureManager.getInstance();
        const userWindowSize = UserWindowSize.getInstance();
        const { scaleX, scaleY } = userWindowSize.getScaleFactors();

        const cardTexture = await textureManager.getTexture('card', card.카드번호);
        const unitJob = parseInt(card.병종, 10);
        const cardGroup = new THREE.Group();

        if (!cardTexture) {
            throw new Error('Card texture not found');
        }

        console.log('card:', card)

        const cardWidth = 0.064935 * window.innerWidth;
        const cardHeight = cardWidth * 1.615;

        // 메인 카드 Mesh 생성
        const mainCardMesh = MeshGenerator.createMesh(cardTexture, cardWidth, cardHeight, position);
        cardGroup.add(mainCardMesh);

        this.saveInitialPosition(mainCardMesh, position, cardWidth, cardHeight, 'mainCardTextureId', indexCount);

        // 무기, 종족, 체력, 에너지 추가
        await this.addOptionalTextures(card, cardGroup, cardWidth, cardHeight, position, unitJob, indexCount);

        // Resize 이벤트 핸들러 등록
        this.registerResizeHandler();

        return cardGroup;
    }

    private static async addOptionalTextures(
        card: any,
        group: THREE.Group,
        cardWidth: number,
        cardHeight: number,
        position: Vector2d,
        unitJob: number,
        indexCount: number
    ) {
        const textureManager = TextureManager.getInstance();

        const textures = await Promise.all([
            unitJob === CardJob.WARRIOR ? textureManager.getTexture('sword_power', card.공격력) : null,
            textureManager.getTexture('race', card.종족),
            textureManager.getTexture('hp', card.체력),
            textureManager.getTexture('energy', 0),
        ]);

        const [weaponTexture, raceTexture, hpTexture, energyTexture] = textures;

        if (weaponTexture) {
            const weaponPosition = new Vector2d(position.getX() + cardWidth * 0.44, position.getY() - cardHeight * 0.45666);
            this.addTextureToGroup(group, weaponTexture, cardWidth * 0.63, cardWidth * 0.63 * 1.651, weaponPosition, 'weaponTextureId', indexCount);
        }

        if (raceTexture) {
            const racePosition = new Vector2d(position.getX() + cardWidth * 0.5, position.getY() + cardHeight * 0.5);
            this.addTextureToGroup(group, raceTexture, cardWidth * 0.4, cardWidth * 0.4, racePosition, 'raceTextureId', indexCount);
        }

        if (hpTexture) {
            const hpPosition = new Vector2d(position.getX() - cardWidth * 0.5, position.getY() - cardHeight * 0.43438);
            this.addTextureToGroup(group, hpTexture, cardWidth * 0.31, cardWidth * 0.31 * 1.65454, hpPosition, 'hpTextureId', indexCount);
        }

        if (energyTexture) {
            const energyPosition = new Vector2d(position.getX() - cardWidth * 0.5, position.getY() + cardHeight * 0.5);
            this.addTextureToGroup(group, energyTexture, cardWidth * 0.39, cardWidth * 0.39 * 1.344907, energyPosition, 'energyTextureId', indexCount);
        }
    }

    private static addTextureToGroup(group: THREE.Group, texture: THREE.Texture, width: number, height: number, position: Vector2d, textureId: string, indexCount: number) {
        const mesh = MeshGenerator.createMesh(texture, width, height, position);
        mesh.userData.textureId = textureId;  // userData로 textureId 저장
        group.add(mesh);
        this.saveInitialPosition(mesh, position, width, height, textureId, indexCount); // 각 텍스처의 정보를 저장합니다.
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
                const { scaleX, scaleY } = UserWindowSize.getInstance().getScaleFactors();
                this.adjustCardPositions(scaleX, scaleY);
            };
            window.addEventListener("resize", this.resizeHandler);
        }
    }

    // static adjustCardPositions(newScaleX: number, newScaleY: number): void {
    //     this.cardInitialInfoMap.forEach(({ cardMesh, initialPosition, width, height }) => {
    //         if (initialPosition) {
    //             const adjustedX = initialPosition.getX() * newScaleX;
    //             const adjustedY = initialPosition.getY() * newScaleY;
    //
    //             // 각 텍스처의 크기를 다시 계산하여 적용
    //             const newWidth = width * newScaleX;
    //             const newHeight = height * newScaleY;
    //
    //             // 메인 카드만 geometry를 새로 적용
    //             cardMesh.geometry = new THREE.PlaneGeometry(newWidth, newHeight);
    //
    //             // 위치 설정
    //             cardMesh.position.set(adjustedX, adjustedY, cardMesh.position.z);
    //         }
    //     });
    // }

    static adjustCardPositions(newScaleX: number, newScaleY: number): void {
        this.cardInitialInfoMap.forEach(({ cardMesh, initialPosition, textureId, cardIndex }) => {

            const cardWidth = 0.06493506493 * window.innerWidth
            const cardHeight = cardWidth * 1.615

            const mainCardPositionX = (0.311904 - 0.5 + cardIndex * 0.094696) * window.innerWidth;
            const mainCardPositionY = (0.5 - 0.972107) * window.innerHeight + (cardHeight * 0.5)

            if (textureId === "mainCardTextureId") {
                // mainCardTextureId인 경우에만 카드 크기 조정
                // const cardWidth = 0.064935 * window.innerWidth;
                // const cardHeight = cardWidth * 1.615;

                // 메인 카드 geometry 재생성
                cardMesh.geometry.dispose(); // 기존 geometry 삭제
                cardMesh.geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);
                // cardMesh.position.set(initialPosition.getX() * newScaleX, initialPosition.getY() * newScaleY, 0);
                // cardMesh.position.set(initialPosition.getX(), (0.5 - 0.972107) * window.innerHeight + (0.06493506493 * 1.615 * 0.5 * window.innerWidth), 0);
                cardMesh.position.set(mainCardPositionX, mainCardPositionY, 0);
            } else if (textureId === "weaponTextureId") {
                // 무기 텍스처 크기 및 위치 조정
                const weaponWidth = cardWidth * 0.63;
                const weaponHeight = weaponWidth * 1.651;

                // position.getX() + cardWidth * 0.44, position.getY() - cardHeight * 0.45666
                // const weaponPositionX = initialPosition.getX() + cardWidth * 0.44;
                const weaponPositionX = mainCardPositionX + cardWidth * 0.44;
                // const weaponPositionY = initialPosition.getY() - cardWidth * 0.45666;
                const weaponPositionY = mainCardPositionY - cardWidth * 0.45666;

                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(weaponWidth, weaponHeight);
                cardMesh.position.set(weaponPositionX * newScaleX, weaponPositionY * newScaleY, 0);

            } else if (textureId === "raceTextureId") {
                // 종족 텍스처 크기 및 위치 조정
                const cardWidth = 0.064935 * window.innerWidth;
                const raceWidth = cardWidth * 0.4;
                const raceHeight = raceWidth;
                const racePositionX = initialPosition.getX() + cardWidth * 0.5;
                const racePositionY = initialPosition.getY() + cardWidth * 0.5;

                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(raceWidth, raceHeight);
                cardMesh.position.set(racePositionX * newScaleX, racePositionY * newScaleY, 0);

            } else if (textureId === "hpTextureId") {
                // 체력 텍스처 크기 및 위치 조정
                const cardWidth = 0.064935 * window.innerWidth;
                const hpWidth = cardWidth * 0.31;
                const hpHeight = hpWidth * 1.65454;
                const hpPositionX = initialPosition.getX() - cardWidth * 0.5;
                const hpPositionY = initialPosition.getY() - cardWidth * 0.43438;

                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(hpWidth, hpHeight);
                cardMesh.position.set(hpPositionX * newScaleX, hpPositionY * newScaleY, 0);

            } else if (textureId === "energyTextureId") {
                // 에너지 텍스처 크기 및 위치 조정
                const cardWidth = 0.064935 * window.innerWidth;
                const energyWidth = cardWidth * 0.39;
                const energyHeight = energyWidth * 1.344907;
                const energyPositionX = initialPosition.getX() - cardWidth * 0.5;
                const energyPositionY = initialPosition.getY() + cardWidth * 0.5;

                cardMesh.geometry.dispose();
                cardMesh.geometry = new THREE.PlaneGeometry(energyWidth, energyHeight);
                cardMesh.position.set(energyPositionX * newScaleX, energyPositionY * newScaleY, 0);
            }
        });
    }
}
