import * as THREE from 'three';
import { ResourceManager } from "../resouce_manager/ResourceManager";
import { NonBackgroundImage } from "../shape/image/NonBackgroundImage";

interface PlacedLocation {
    card: THREE.Vector2;
    weapon: THREE.Vector2;
    hp: THREE.Vector2;
    energy: THREE.Vector2;
    race: THREE.Vector2;
}

export class BattleFieldUnit {
    private card: NonBackgroundImage | null = null;
    private weapon: NonBackgroundImage | null = null;
    private hp: NonBackgroundImage | null = null;
    private energy: NonBackgroundImage | null = null;
    private race: NonBackgroundImage | null = null;

    constructor(
        scene: THREE.Scene,
        resourceManager: ResourceManager,
        cardId: number,
        weaponId: number,
        hpId: number,
        energyId: number,
        raceId: number,
        cardWidth: number,
        placedLocation?: PlacedLocation
    ) {
        const cardHeight = cardWidth * 1.615;

        const cardPath = resourceManager.getCardPath(cardId);
        const weaponPath = resourceManager.getWeaponPath(weaponId);
        const hpPath = resourceManager.getHpPath(hpId);
        const energyPath = resourceManager.getEnergyPath(energyId);
        const racePath = resourceManager.getRacePath(raceId);

        const defaultLocation: PlacedLocation = {
            card: new THREE.Vector2(0, 0),
            weapon: new THREE.Vector2(cardWidth / 2 - 8, -cardHeight / 2 + 8),
            hp: new THREE.Vector2(-cardWidth / 2, -cardHeight / 2 + 13),
            energy: new THREE.Vector2(-cardWidth / 2, cardHeight / 2),
            race: new THREE.Vector2(cardWidth / 2, cardHeight / 2)
        };

        const location = placedLocation || defaultLocation;

        this.card = new NonBackgroundImage(cardWidth, cardHeight, cardPath, 1, 1, location.card, undefined, undefined, undefined, undefined, undefined, () => {
            if (this.card) {
                this.card.draw(scene);
                // Draw other components after the card
                this.drawComponents(scene, location, weaponPath, hpPath, energyPath, racePath, cardWidth);
            }
        });
    }

    private drawComponents(
        scene: THREE.Scene,
        location: PlacedLocation,
        weaponPath: string,
        hpPath: string,
        energyPath: string,
        racePath: string,
        cardWidth: number
    ) {
        const weaponWidth = cardWidth * 0.63; // 기존 비율로 계산
        const weaponHeight = weaponWidth * 1.651;
        this.weapon = new NonBackgroundImage(weaponWidth, weaponHeight, weaponPath, 1, 1, location.weapon, undefined, undefined, undefined, undefined, undefined, () => {
            if (this.weapon) {
                this.weapon.draw(scene);
            }
        });

        const hpWidth = cardWidth * 0.33; // 기존 비율로 계산
        const hpHeight = hpWidth * 1.651;
        this.hp = new NonBackgroundImage(hpWidth, hpHeight, hpPath, 1, 1, location.hp, undefined, undefined, undefined, undefined, undefined, () => {
            if (this.hp) {
                this.hp.draw(scene);
            }
        });

        const energyWidth = cardWidth * 0.39; // 기존 비율로 계산
        const energyHeight = energyWidth * 1.618;
        this.energy = new NonBackgroundImage(energyWidth, energyHeight, energyPath, 1, 1, location.energy, undefined, undefined, undefined, undefined, undefined, () => {
            if (this.energy) {
                this.energy.draw(scene);
            }
        });

        const raceWidth = cardWidth * 0.4; // 기존 비율로 계산
        const raceHeight = raceWidth;
        this.race = new NonBackgroundImage(raceWidth, raceHeight, racePath, 1, 1, location.race, undefined, undefined, undefined, undefined, undefined, () => {
            if (this.race) {
                this.race.draw(scene);
            }
        });
    }
}
