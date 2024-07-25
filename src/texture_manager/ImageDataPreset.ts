export enum ImagePresetType {
    CARD = 'card',
    WEAPON = 'weapon',
    HP = 'hp',
    ENERGY = 'energy',
    RACE = 'race',
    BACKGROUND = 'background'
}

export const CARD_WIDTH = 150;
export const CARD_HEIGHT = CARD_WIDTH * 1.615;
export const CARD_RESOURCE_PATH = 'resource/battle_field_unit/card/';

export const WEAPON_WIDTH = CARD_WIDTH * 0.63;
export const WEAPON_HEIGHT = WEAPON_WIDTH * 1.651;
export const WEAPON_RESOURCE_PATH = 'resource/battle_field_unit/sword_power/';

export const HP_WIDTH = CARD_WIDTH * 0.33;
export const HP_HEIGHT = HP_WIDTH * 1.651;
export const HP_RESOURCE_PATH = 'resource/battle_field_unit/hp/';

export const ENERGY_WIDTH = CARD_WIDTH * 0.39;
export const ENERGY_HEIGHT = ENERGY_WIDTH * 1.618;
export const ENERGY_RESOURCE_PATH = 'resource/battle_field_unit/energy/';

export const RACE_WIDTH = CARD_WIDTH * 0.4;
export const RACE_HEIGHT = RACE_WIDTH;
export const RACE_RESOURCE_PATH = 'resource/battle_field_unit/race/';

export const BACKGROUND_WIDTH = 1920;
export const BACKGROUND_HEIGHT = 1080;
export const BACKGROUND_RESOURCE_PATH = 'resource/background/';

interface ImagePreset {
    width: number;
    height: number;
    path: string;
}

export class ImageDataPreset {
    private static presets: { [key in ImagePresetType]: ImagePreset } = {
        [ImagePresetType.CARD]: { width: CARD_WIDTH, height: CARD_HEIGHT, path: CARD_RESOURCE_PATH },
        [ImagePresetType.WEAPON]: { width: WEAPON_WIDTH, height: WEAPON_HEIGHT, path: WEAPON_RESOURCE_PATH },
        [ImagePresetType.HP]: { width: HP_WIDTH, height: HP_HEIGHT, path: HP_RESOURCE_PATH },
        [ImagePresetType.ENERGY]: { width: ENERGY_WIDTH, height: ENERGY_HEIGHT, path: ENERGY_RESOURCE_PATH },
        [ImagePresetType.RACE]: { width: RACE_WIDTH, height: RACE_HEIGHT, path: RACE_RESOURCE_PATH },
        [ImagePresetType.BACKGROUND]: { width: BACKGROUND_WIDTH, height: BACKGROUND_HEIGHT, path: BACKGROUND_RESOURCE_PATH }
    };

    public static getPreset(key: ImagePresetType): ImagePreset | null {
        return this.presets[key] || null;
    }
}
