import * as THREE from 'three';

interface ImageInfo {
    relative_path: string;
    reference_path: string;
}

export class TextureManager {
    private static instance: TextureManager;
    private battleFieldUnitCardTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitWeaponTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitHpTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitEnergyTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitRaceTextureList: { [id: number]: THREE.Texture } = {};

    private constructor() {}

    public static getInstance(): TextureManager {
        if (!TextureManager.instance) {
            TextureManager.instance = new TextureManager();
        }
        return TextureManager.instance;
    }

    public async preloadTextures(jsonUrl: string): Promise<void> {
        // console.log(`Fetching image paths from: ${jsonUrl}`);

        try {
            const response = await fetch(jsonUrl);
            const imageData = await response.json();
            // console.log('imageData:', imageData);

            // if (imageData.card) this.loadTextures(imageData.card, this.battleFieldUnitCardTextureList);
            // if (imageData.weapon) this.loadTextures(imageData.weapon, this.battleFieldUnitWeaponTextureList);
            // if (imageData.hp) this.loadTextures(imageData.hp, this.battleFieldUnitHpTextureList);
            // if (imageData.energy) this.loadTextures(imageData.energy, this.battleFieldUnitEnergyTextureList);
            // if (imageData.race) this.loadTextures(imageData.race, this.battleFieldUnitRaceTextureList);

            await Promise.all([
                this.loadTextures(imageData.card, this.battleFieldUnitCardTextureList),
                this.loadTextures(imageData.weapon, this.battleFieldUnitWeaponTextureList),
                this.loadTextures(imageData.hp, this.battleFieldUnitHpTextureList),
                this.loadTextures(imageData.energy, this.battleFieldUnitEnergyTextureList),
                this.loadTextures(imageData.race, this.battleFieldUnitRaceTextureList)
            ]);

            console.log('All textures preloaded from TextureManager.ts');
        } catch (error) {
            console.error(`Failed to fetch or parse JSON from: ${jsonUrl}`, error);
        }
    }

    private getBasePath(): string {
        return window.location.origin; // 현재 작업 디렉토리 경로를 반환
    }

    private loadTextures(images: string[], textureList: { [id: number]: THREE.Texture }): Promise<void> {
        const promises = images.map((imagePath) => {
            return new Promise<void>((resolve, reject) => {
                const textureLoader = new THREE.TextureLoader();
                const fullPath = imagePath;
                // console.log('Loading texture:', fullPath);
                textureLoader.load(
                    fullPath,
                    (texture) => {
                        const id = this.extractIdFromPath(imagePath);
                        if (id !== null) {
                            textureList[id] = texture;
                            // console.log(`Loaded texture: ${fullPath} with id: ${id}`);
                        }
                        resolve();
                    },
                    undefined, // onProgress 콜백
                    (error) => {
                        console.error(`An error occurred loading the texture ${fullPath}:`, error);
                        reject(error);
                    }
                );
            });
        });
        return Promise.all(promises).then(() => {});
    }

    private extractIdFromPath(path: string): number | null {
        const match = path.match(/(\d+)\.png$/);
        return match ? parseInt(match[1], 10) : null;
    }

    public getTexture(category: string, id: number): THREE.Texture | undefined {
        console.log('getTexture -> category:', category, ',id:', id)
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
