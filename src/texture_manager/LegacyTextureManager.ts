import * as THREE from 'three';

interface ImageInfo {
    relative_path: string;
    reference_path: string;
}

export class LegacyTextureManager {
    private static instance: LegacyTextureManager;
    private battleFieldUnitCardTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitWeaponTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitHpTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitEnergyTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitRaceTextureList: { [id: number]: THREE.Texture } = {};

    private constructor() {}

    public static getInstance(): LegacyTextureManager {
        if (!LegacyTextureManager.instance) {
            LegacyTextureManager.instance = new LegacyTextureManager();
        }
        return LegacyTextureManager.instance;
    }

    public async preloadTextures(jsonUrl: string): Promise<void> {
        console.log(`Fetching image paths from: ${jsonUrl}`);

        const response = await fetch(jsonUrl);
        const imageData = await response.json();

        this.loadTextures(imageData.card, this.battleFieldUnitCardTextureList);
        this.loadTextures(imageData.weapon, this.battleFieldUnitWeaponTextureList);
        this.loadTextures(imageData.hp, this.battleFieldUnitHpTextureList);
        this.loadTextures(imageData.energy, this.battleFieldUnitEnergyTextureList);
        this.loadTextures(imageData.race, this.battleFieldUnitRaceTextureList);
    }

    private loadTextures(images: ImageInfo[], textureList: { [id: number]: THREE.Texture }): void {
        images.forEach((imageInfo) => {
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                imageInfo.reference_path, // 경로를 relative_path 대신 reference_path 사용
                (texture) => {
                    const id = this.extractIdFromPath(imageInfo.reference_path);
                    if (id !== null) {
                        textureList[id] = texture;
                    }
                },
                undefined, // onProgress 콜백
                (error) => {
                    console.error(`An error occurred loading the texture ${imageInfo.relative_path}:`, error);
                }
            );
        });
    }

    private extractIdFromPath(path: string): number | null {
        const match = path.match(/(\d+)\.png$/);
        return match ? parseInt(match[1], 10) : null;
    }

    public getTexture(category: string, id: number): THREE.Texture | undefined {
        switch (category) {
            case 'card':
                return this.battleFieldUnitCardTextureList[id];
            case 'weapon':
                return this.battleFieldUnitWeaponTextureList[id];
            case 'hp':
                return this.battleFieldUnitHpTextureList[id];
            case 'energy':
                return this.battleFieldUnitEnergyTextureList[id];
            case 'race':
                return this.battleFieldUnitRaceTextureList[id];
            default:
                return undefined;
        }
    }
}

// // 예제 사용법:
// const textureManager = LegacyTextureManager.getInstance();
// textureManager.preloadTextures('image-paths.json').then(() => {
//     console.log('All textures preloaded.');
// });
