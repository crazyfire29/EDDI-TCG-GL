interface BattleFieldUnitPathInfo {
    cardPath: string;
    weaponPath: string;
    hpPath: string;
    energyPath: string;
    racePath: string;
    [key: string]: string; // 문자열 인덱스 시그니처 추가
}

export class ResourceManager {
    private pathInfo: BattleFieldUnitPathInfo | null = null;

    public registerBattleFieldUnitPath(pathInfo: BattleFieldUnitPathInfo): void {
        this.pathInfo = pathInfo;
    }

    private getPath(subPath: string): string {
        if (!this.pathInfo) {
            throw new Error('Path information not registered.');
        }
        return this.pathInfo[subPath];
    }

    public getCardPath(cardId: number): string {
        return this.getPath('cardPath').replace('{id}', cardId.toString());
    }

    public getWeaponPath(weaponId: number): string {
        return this.getPath('weaponPath').replace('{id}', weaponId.toString());
    }

    public getHpPath(hpId: number): string {
        return this.getPath('hpPath').replace('{id}', hpId.toString());
    }

    public getEnergyPath(energyId: number): string {
        return this.getPath('energyPath').replace('{id}', energyId.toString());
    }

    public getRacePath(raceId: number): string {
        return this.getPath('racePath').replace('{id}', raceId.toString());
    }
}
