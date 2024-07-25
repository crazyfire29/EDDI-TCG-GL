// import {LegacyTextureManager} from "../../src/texture_manager/LegacyTextureManager";
import {TextureManager} from "../../src/texture_manager/TextureManager";

// const textureManager = LegacyTextureManager.getInstance();
const textureManager = TextureManager.getInstance();

// textureManager.preloadTextures('resource/image-paths.json').then(() => {
//     console.log('All textures preloaded.');
//
//     // 필요한 텍스처 사용 예시
//     const cardTexture = textureManager.getTexture('card', 1);
//     const weaponTexture = textureManager.getTexture('weapon', 1);
//
//     if (cardTexture) {
//         console.log('Card texture loaded:', cardTexture);
//     }
//
//     if (weaponTexture) {
//         console.log('Weapon texture loaded:', weaponTexture);
//     }
// }).catch((error: any) => {
//     console.error('Error preloading textures:', error);
// });

function getResourceUrl(aliasPath: string): string {
    if (aliasPath.startsWith('@resource')) {
        return aliasPath.replace('@resource', '/resource');
    }
    return aliasPath;
}

// import imagePaths from '@resource/image-paths.json';
//
// console.log('from main resource:', imagePaths);

// const jsonUrl = getResourceUrl('@resource/image-paths.json');
//
// console.log('Fetching image paths from:', jsonUrl);

textureManager.preloadTextures("image-paths.json")
    .then(() => {
        console.log('All textures preloaded: from pre_texture_load.ts');

        // 필요한 텍스처 사용 예시
        const cardTexture = textureManager.getTexture('card', 19);
        const weaponTexture = textureManager.getTexture('weapon', 20);

        if (cardTexture) {
            console.log('Card texture loaded:', cardTexture);
        } else {
            console.log('Card texture not found.');
        }

        if (weaponTexture) {
            console.log('Weapon texture loaded:', weaponTexture);
        } else {
            console.log('Weapon texture not found.');
        }
    })
    .catch((error: any) => {
        console.error('Error preloading textures:', error);
    });