import { getCardById } from "../../src/card/utility";
import { CardRace } from "../../src/card/race";
import { CardGrade } from "../../src/card/grade";
import { CardKind } from "../../src/card/kind";
import { TextureManager } from "../../src/texture_manager/TextureManager";
import { Vector2d } from "../../src/common/math/Vector2d";
import * as THREE from "three";
import {LegacyNonBackgroundImage} from "../../src/shape/image/LegacyNonBackgroundImage";

const container = document.body;

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

const aspect = width / height;
const viewSize = height;
const camera = new THREE.OrthographicCamera(
    -aspect * viewSize / 2, aspect * viewSize / 2,
    viewSize / 2, -viewSize / 2,
    0.1, 1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const backgroundImagePath = 'resource/background/battle_field.png'
const backgroundWidth = viewSize * aspect
const backgroundHeight = viewSize
const background = new LegacyNonBackgroundImage(backgroundWidth, backgroundHeight, backgroundImagePath, 1, 1, new THREE.Vector2(0, 0), undefined, undefined, undefined, undefined, undefined, () => {
    background.draw(scene)
})

function renderCardTextures(
    cardTexture: THREE.Texture | null,
    cardKindsTexture: THREE.Texture | null,
    cardRaceTexture: THREE.Texture | null
) {
    // 기존 씬에서 카드 메쉬 제거
    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            scene.remove(child);
        }
    });

    // 카드 텍스처가 없으면 종료
    if (!cardTexture) {
        console.error('No card texture provided.');
        return;
    }

    // 카드 텍스처 재질 생성
    const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
    const cardGeometry = new THREE.PlaneGeometry(2, 3); // 카드 크기에 맞게 조정
    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
    scene.add(cardMesh);

    // 카드 종류 및 카드 종족 텍스처를 사용할 경우 추가 메쉬 생성
    if (cardKindsTexture) {
        const kindsMaterial = new THREE.MeshBasicMaterial({ map: cardKindsTexture });
        const kindsGeometry = new THREE.PlaneGeometry(1, 1); // 크기 조정 필요
        const kindsMesh = new THREE.Mesh(kindsGeometry, kindsMaterial);
        kindsMesh.position.set(0, 1.5, 0); // 카드 위에 배치
        scene.add(kindsMesh);
    }

    if (cardRaceTexture) {
        const raceMaterial = new THREE.MeshBasicMaterial({ map: cardRaceTexture });
        const raceGeometry = new THREE.PlaneGeometry(1, 1); // 크기 조정 필요
        const raceMesh = new THREE.Mesh(raceGeometry, raceMaterial);
        raceMesh.position.set(0, -1.5, 0); // 카드 아래에 배치
        scene.add(raceMesh);
    }

    // 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.rotation.y += 0.01; // 카드 회전 애니메이션
            }
        });
        renderer.render(scene, camera);
    }
    animate();
}

async function createSupportCard(card: any) {
    console.log("Creating support card with data:", card);
    const cardId = card.카드번호;
    const cardKinds = card.종류;
    const cardRace = card.종족;

    const textureManager = TextureManager.getInstance();
    const cardTexture = await textureManager.getTexture('card', cardId);
    const cardKindsTexture = await textureManager.getTexture('card_kinds', cardKinds);
    const cardRaceTexture = await textureManager.getTexture('race', cardRace);

    console.log('Card texture:', cardTexture);
    console.log('Card kinds texture:', cardKindsTexture);
    console.log('Card race texture:', cardRaceTexture);

    // renderCardTextures(cardTexture || null, cardKindsTexture || null, cardRaceTexture || null);
}

function createUnitCard(card: any) {
    console.log("Creating a UNIT card:", card);
    // 카드 생성 코드 추가
}

function createItemCard(card: any) {
    console.log("Creating an ITEM card:", card);
    // 카드 생성 코드 추가
}

function createTrapCard(card: any) {
    console.log("Creating a TRAP card:", card);
    // 카드 생성 코드 추가
}

function createToolCard(card: any) {
    console.log("Creating a TOOL card:", card);
    // 카드 생성 코드 추가
}

function createEnergyCard(card: any) {
    console.log("Creating a ENERGY card:", card);
    // 카드 생성 코드 추가
}

function createEnvironmentCard(card: any) {
    console.log("Creating a ENVIRONMENT card:", card);
    // 카드 생성 코드 추가
}

function createTokenCard(card: any) {
    console.log("Creating a TOKEN card:", card);
    // 카드 생성 코드 추가
}

const cardKindHandlers: { [key in CardKind]?: (card: any) => void } = {
    [CardKind.UNIT]: createUnitCard,
    [CardKind.ITEM]: createItemCard,
    [CardKind.TRAP]: createTrapCard,
    [CardKind.SUPPORT]: createSupportCard,
    [CardKind.TOOL]: createToolCard,
    [CardKind.ENERGY]: createEnergyCard,
    [CardKind.ENVIRONMENT]: createEnvironmentCard,
    [CardKind.TOKEN]: createTokenCard,
};

async function main() {
    try {
        const textureManager = TextureManager.getInstance();
        await textureManager.preloadTextures("image-paths.json");

        const cardIdToFind = 2;
        const card = getCardById(cardIdToFind);

        if (card) {
            const damage = card.공격력;
            const hp = card.체력 !== null ? card.체력 : "No HP specified";
            const race = CardRace[parseInt(card.종족, 10)] as keyof typeof CardRace;
            const gradeInt = parseInt(card.등급, 10);
            const grade = CardGrade[gradeInt] as keyof typeof CardGrade;
            const kindInt = parseInt(card.종류, 10) as CardKind;
            const kind = CardKind[kindInt] as keyof typeof CardKind;
            const requiredEnergy = card.필요_에너지;

            console.log('Card found:');
            console.log('공격력:', damage);
            console.log('체력:', hp);
            console.log('종족:', race);
            console.log('등급:', grade);
            console.log('종류_enum:', kindInt);
            console.log('종류:', kind);
            console.log('필요_에너지:', requiredEnergy);
            console.log('type(필요_에너지):', typeof requiredEnergy);

            const handler = cardKindHandlers[kindInt];
            if (handler) {
                await handler(card); // 핸들러 함수가 비동기적일 수 있으므로 await
            } else {
                console.log('No handler for CardKind:', CardKind[kindInt]);
            }
        } else {
            console.log('Card not found');
        }
    } catch (error) {
        console.error('Error in main function:', error);
    }
}

main().catch(console.error);

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();
