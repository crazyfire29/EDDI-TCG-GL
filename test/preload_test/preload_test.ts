// import * as fs from 'fs';
// import * as path from 'path';
//
// class ResourceManager {
//     private static instance: ResourceManager;
//     private textureLoader: THREE.TextureLoader;
//     private textures: { [key: string]: THREE.Texture } = {};
//     private paths = {
//         card: 'resource/battle_field_unit/card/',
//         weapon: 'resource/battle_field_unit/sword_power/',
//         hp: 'resource/battle_field_unit/hp/',
//         energy: 'resource/battle_field_unit/energy/',
//         race: 'resource/battle_field_unit/race/'
//     };
//
//     private constructor() {
//         this.textureLoader = new THREE.TextureLoader();
//     }
//
//     public static getInstance(): ResourceManager {
//         if (!ResourceManager.instance) {
//             ResourceManager.instance = new ResourceManager();
//         }
//         return ResourceManager.instance;
//     }
//
//     public async preLoadImages(): Promise<void> {
//         const promises: Promise<void>[] = [];
//         const self = this; // 'this'를 로컬 변수에 저장
//         (Object.keys(self.paths) as Array<keyof typeof self.paths>).forEach((category) => {
//             promises.push(self.loadImages(category));
//         });
//         await Promise.all(promises);
//     }
//
//     private async loadImages(category: keyof typeof ResourceManager.instance.paths): Promise<void> {
//         // const path = this.paths[category];
//         // const response = await fetch(`/${path}`);
//         // const imageCount = await response.json(); // Assuming the server returns the number of images in the directory
//         // for (let i = 1; i <= imageCount; i++) {
//         //     const imagePath = `${path}${i}.png`;
//         //     this.textureLoader.load(imagePath, (texture) => {
//         //         this.textures[imagePath] = texture;
//         //     });
//         // }
//         const dirPath = path.join(__dirname, this.paths[category]);
//         const files = fs.readdirSync(dirPath);
//         const pngFiles = files.filter(file => file.endsWith('.png'));
//         for (const file of pngFiles) {
//             const imagePath = path.join(dirPath, file);
//             this.textureLoader.load(imagePath, (texture) => {
//                 this.textures[imagePath] = texture;
//             });
//         }
//     }
//
//     public getTexture(category: keyof typeof ResourceManager.instance.paths, id: number): THREE.Texture | null {
//         const imagePath = `${this.paths[category]}${id}.png`;
//         return this.textures[imagePath] || null;
//     }
// }
//
// export { ResourceManager };
//
// import * as THREE from 'three';
// import { NonBackgroundImage } from '../../src/shape/image/NonBackgroundImage';
//
// (async () => {
//     const container = document.body;
//
//     const width = window.innerWidth;
//     const height = window.innerHeight;
//
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(width, height);
//     container.appendChild(renderer.domElement);
//
//     const aspect = width / height;
//     const viewSize = height;
//     const camera = new THREE.OrthographicCamera(
//         -aspect * viewSize / 2, aspect * viewSize / 2,
//         viewSize / 2, -viewSize / 2,
//         0.1, 1000
//     );
//     camera.position.set(0, 0, 5);
//     camera.lookAt(0, 0, 0);
//
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xffffff);
//
//     const resourceManager = ResourceManager.getInstance();
//     await resourceManager.preLoadImages();
//
//     const cardId = 19;
//     const cardWidth = 150;
//     const cardHeight = cardWidth * 1.615;
//
//     const cardTexture = resourceManager.getTexture('card', cardId);
//     const cardImagePath = `resource/battle_field_unit/card/${cardId}.png`;
//     const card = new NonBackgroundImage(cardWidth, cardHeight, cardImagePath, 1, 1, new THREE.Vector2(0, 0), undefined, undefined, undefined, undefined, undefined, () => {
//         card.draw(scene);
//     });
//     if (cardTexture) {
//         card.setTexture(cardTexture);
//     } else {
//         card.loadTexture();
//     }
//
//     // 애니메이션 루프 설정
//     function animate() {
//         requestAnimationFrame(animate);
//         renderer.render(scene, camera);
//     }
//
//     animate();
// })();

import * as THREE from 'three';
import {ResourceManagerTest} from "../../src/resouce_manager/ResourceManagerTest";
import {NonBackgroundImage} from "../../src/shape/image/NonBackgroundImage";

(async () => {
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

    const resourceManager = ResourceManagerTest.getInstance();
    await resourceManager.preLoadImages();

    const cardId = 19;
    const cardWidth = 150;
    const cardHeight = cardWidth * 1.615;

    const cardTexture = resourceManager.getTexture('card', cardId);
    const cardImagePath = `resource/battle_field_unit/card/${cardId}.png`;
    const card = new NonBackgroundImage(cardWidth, cardHeight, cardImagePath, 1, 1, new THREE.Vector2(0, 0), undefined, undefined, undefined, undefined, undefined, () => {
        card.draw(scene);
    });
    if (cardTexture) {
        card.setTexture(cardTexture);
    } else {
        card.loadTexture();
    }

    // 애니메이션 루프 설정
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
})();
