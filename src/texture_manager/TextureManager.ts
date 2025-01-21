import * as THREE from 'three';

interface ImageInfo {
    relative_path: string;
    reference_path: string;
}

export class TextureManager {
    private static instance: TextureManager;
    private isTexturesPreloaded: boolean = false

    private battleFieldUnitCardTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitSwordPowerTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitStaffPowerTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitHpTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitEnergyTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldUnitRaceTextureList: { [id: number]: THREE.Texture } = {};
    private mainLobbyBackgroundTextureList: { [id: number]: THREE.Texture } = {};
    private mainLobbyButtonsTextureList: { [id: number]: THREE.Texture } = {};
    private shopBackgroundTextureList: { [id: number]: THREE.Texture } = {};
    private shopButtonsTextureList: { [id: number]: THREE.Texture } = {};
    private shopSelectScreenTextureList: { [id: number]: THREE.Texture } = {};
    private shopYesOrNoButtonTextureList: { [id: number]: THREE.Texture } = {};
    private selectCardScreenTextureList: { [id: number]: THREE.Texture } = {};
    private tryAgainScreenTextureList: { [id: number]: THREE.Texture } = {};
    private tryAgainButtonsTextureList: { [id: number]: THREE.Texture } = {};
    private battleFieldBackgroundTextureList: { [id: number]: THREE.Texture } = {};
    private myCardBackgroundTextureList: { [id: number]: THREE.Texture } = {};
    private myCardPageMovementTextureList: { [id: number]: THREE.Texture } = {};
    private myDeckBackgroundTextureList: { [id: number]: THREE.Texture } = {};
    private myDeckButtonsTextureList: { [id: number]: THREE.Texture } = {};
    private deckPageMovementButtonsTextureList : { [id: number]: THREE.Texture } = {};
    private myDeckCardPageMovementButtonTextureList : { [id: number]: THREE.Texture } = {};
    private cardKindsTextureList: { [id: number]: THREE.Texture } = {};
    private deckMakingPopupBackgroundTextureList: { [id: number]: THREE.Texture } = {};
    private deckMakingPopupButtonsTextureList: { [id: number]: THREE.Texture } = {};

    private constructor() {}

    public static getInstance(): TextureManager {
        if (!TextureManager.instance) {
            TextureManager.instance = new TextureManager();
        }
        return TextureManager.instance;
    }

    public async preloadTextures(jsonUrl: string): Promise<void> {
        if (this.isTexturesPreloaded) {
            console.log('Textures already preloaded.');
            return;
        }

        try {
            const response = await fetch(jsonUrl);
            const imageData = await response.json();
            console.log('imageData:', imageData);

            await Promise.all([
                this.loadTextures(imageData.card, this.battleFieldUnitCardTextureList),
                this.loadTextures(imageData.sword_power, this.battleFieldUnitSwordPowerTextureList),
                this.loadTextures(imageData.staff_power, this.battleFieldUnitStaffPowerTextureList),
                this.loadTextures(imageData.hp, this.battleFieldUnitHpTextureList),
                this.loadTextures(imageData.energy, this.battleFieldUnitEnergyTextureList),
                this.loadTextures(imageData.race, this.battleFieldUnitRaceTextureList),
                this.loadTextures(imageData.main_lobby_background, this.mainLobbyBackgroundTextureList),
                this.loadTextures(imageData.main_lobby_buttons, this.mainLobbyButtonsTextureList),
                this.loadTextures(imageData.shop_background, this.shopBackgroundTextureList),
                this.loadTextures(imageData.shop_buttons, this.shopButtonsTextureList),
                this.loadTextures(imageData.shop_select_screens, this.shopSelectScreenTextureList),
                this.loadTextures(imageData.shop_yes_or_no_button, this.shopYesOrNoButtonTextureList),
                this.loadTextures(imageData.select_card_screen, this.selectCardScreenTextureList),
                this.loadTextures(imageData.try_again_screen, this.tryAgainScreenTextureList),
                this.loadTextures(imageData.try_again_buttons, this.tryAgainButtonsTextureList),
                this.loadTextures(imageData.battle_field_background, this.battleFieldBackgroundTextureList),
                this.loadTextures(imageData.my_card_background, this.myCardBackgroundTextureList),
                this.loadTextures(imageData.my_card_page_movement_button, this.myCardPageMovementTextureList),
                this.loadTextures(imageData.my_deck_background, this.myDeckBackgroundTextureList),
                this.loadTextures(imageData.my_deck_buttons, this.myDeckButtonsTextureList),
                this.loadTextures(imageData.deck_page_movement_buttons, this.deckPageMovementButtonsTextureList),
                this.loadTextures(imageData.deck_card_page_movement_buttons, this.myDeckCardPageMovementButtonTextureList),
                this.loadTextures(imageData.card_kinds, this.cardKindsTextureList),
                this.loadTextures(imageData.deck_making_pop_up_background, this.deckMakingPopupBackgroundTextureList),
                this.loadTextures(imageData.deck_making_pop_up_buttons, this.deckMakingPopupButtonsTextureList),
            ]);

            console.log('All textures preloaded from TextureManager.ts');
            console.log('mainLobbyBackgroundTextureList:', this.mainLobbyBackgroundTextureList);
            this.isTexturesPreloaded = true
        } catch (error) {
            console.error(`Failed to fetch or parse JSON from: ${jsonUrl}`, error);
        }
    }

    private getBasePath(): string {
        return window.location.origin; // 현재 작업 디렉토리 경로를 반환
    }

    private loadTextures(images: string[], textureList: { [id: number]: THREE.Texture | undefined }): Promise<void> {
        const textureIdMap: Map<number, string> = new Map(); // ID와 경로 매핑
        let currentIndex = 1;

        // 이미지 경로에서 ID를 추출하고 ID와 경로를 매핑합니다.
        images.forEach((imagePath) => {
            const id = this.extractIdFromPath(imagePath);
            if (id !== null) {
                textureIdMap.set(id, imagePath);
            } else {
                // 이름 기반 텍스처 처리
                if (this.isNameBasedTexture(imagePath)) {
                    textureIdMap.set(currentIndex, imagePath);
                    currentIndex++;
                }
            }
        });

        // 텍스처를 ID 순서에 맞게 로드합니다.
        const texturePromises = Array.from(textureIdMap.keys()).sort((a, b) => a - b).map((id) => {
            return new Promise<void>((resolve, reject) => {
                const textureLoader = new THREE.TextureLoader();
                const imagePath = textureIdMap.get(id)!;

                textureLoader.load(
                    imagePath,
                    (texture) => {
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.magFilter = THREE.LinearFilter;
                        texture.minFilter = THREE.LinearFilter;
                        texture.generateMipmaps = false;
                        textureList[id] = texture;
                        resolve();
                    },
                    undefined,
                    (error) => {
                        console.error(`Error loading texture for path: ${imagePath}`, error);
                        reject(error);
                    }
                );
            });
        });
        return Promise.all(texturePromises).then(() => {
            console.log(`Loaded textures: ${Object.keys(textureList).length}`);
        });
    }

    private isNameBasedTexture(path: string): boolean {
        // 여기에 이름 기반 텍스처의 패턴을 정의합니다.
        return /\.(png|jpg)$/i.test(path) && !this.extractIdFromPath(path);
    }

    private extractIdFromPath(path: string): number | null {
        const match = path.match(/(\d+)\.png$/);
        return match ? parseInt(match[1], 10) : null;
    }

    public async getTexture(category: string, id: number): Promise<THREE.Texture | undefined> {
        if (!this.isTexturesPreloaded) {
            console.warn('Textures are not yet preloaded. Waiting for preload to complete...');
            await this.preloadTextures("image-paths.json"); // 텍스처가 로드될 때까지 대기
        }

        console.log('getTexture -> category:', category, ',id:', id)
        switch (category) {
            case 'card':
                return this.battleFieldUnitCardTextureList[id];
            case 'sword_power':
                return this.battleFieldUnitSwordPowerTextureList[id];
            case 'staff_power':
                return this.battleFieldUnitStaffPowerTextureList[id];
            case 'hp':
                return this.battleFieldUnitHpTextureList[id];
            case 'energy':
                return this.battleFieldUnitEnergyTextureList[id];
            case 'race':
                return this.battleFieldUnitRaceTextureList[id];
            case 'main_lobby_background':
                return this.mainLobbyBackgroundTextureList[id];
            case 'main_lobby_buttons':
                return this.mainLobbyButtonsTextureList[id];
            case 'shop_background':
                return this.shopBackgroundTextureList[id]
            case 'shop_buttons':
                return this.shopButtonsTextureList[id]
            case 'shop_select_screens':
                return this.shopSelectScreenTextureList[id]
            case 'shop_yes_or_no_button':
                return this.shopYesOrNoButtonTextureList[id]
            case 'select_card_screen':
                return this.selectCardScreenTextureList[id]
            case 'try_again_screen':
                return this.tryAgainScreenTextureList[id]
            case 'try_again_buttons':
                return this.tryAgainButtonsTextureList[id]
            case 'battle_field_background':
                return this.battleFieldBackgroundTextureList[id]
            case 'my_card_background':
                return this.myCardBackgroundTextureList[id]
            case 'my_card_page_movement_button':
                return this.myCardPageMovementTextureList[id]
            case 'my_deck_background':
                return this.myDeckBackgroundTextureList[id]
            case 'my_deck_buttons':
                return this.myDeckButtonsTextureList[id]
            case 'deck_page_movement_buttons':
                return this.deckPageMovementButtonsTextureList[id]
            case 'deck_card_page_movement_buttons':
                return this.myDeckCardPageMovementButtonTextureList[id]
            case 'card_kinds':
                return this.cardKindsTextureList[id]
            case 'deck_making_pop_up_background':
                return this.deckMakingPopupBackgroundTextureList[id]
            case 'deck_making_pop_up_buttons':
                return this.deckMakingPopupButtonsTextureList[id]
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
