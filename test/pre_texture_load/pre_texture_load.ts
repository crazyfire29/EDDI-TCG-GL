import {TextureManager} from "../../src/texture_manager/TextureManager";

const textureManager = TextureManager.getInstance();

textureManager.preloadTextures('resource/image-paths.json').then(() => {
    console.log('All textures preloaded.');

    // 필요한 텍스처 사용 예시
    const cardTexture = textureManager.getTexture('card', 1);
    const weaponTexture = textureManager.getTexture('weapon', 1);

    if (cardTexture) {
        console.log('Card texture loaded:', cardTexture);
    }

    if (weaponTexture) {
        console.log('Weapon texture loaded:', weaponTexture);
    }
}).catch((error: any) => {
    console.error('Error preloading textures:', error);
});
