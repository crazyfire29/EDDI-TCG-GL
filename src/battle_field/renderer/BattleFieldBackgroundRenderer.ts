import * as THREE from 'three';
import { BattleFieldBackgroundService } from '../service/BattleFieldBackgroundService';
import { BattleFieldBackgroundScene } from '../scene/BattleFieldBackgroundScene';
import {Vector2d} from "../../common/math/Vector2d";

export class BattleFieldBackgroundRenderer {
    private backgroundService: BattleFieldBackgroundService;
    private backgroundScene: BattleFieldBackgroundScene;

    constructor(backgroundService: BattleFieldBackgroundService, backgroundScene: BattleFieldBackgroundScene) {
        this.backgroundService = backgroundService;
        this.backgroundScene = backgroundScene;
    }

    public render(renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera): void {
        renderer.render(this.backgroundScene.getScene(), camera);
    }

    public resize(newHeight: number, newAspect: number): void {
        this.backgroundScene.resizeBackground(newHeight, newAspect);
    }

    public animate(): void {
        // 애니메이션 로직을 여기에 추가합니다.
        requestAnimationFrame(() => this.animate());
        // 필요한 애니메이션 업데이트 로직을 여기에 추가
    }

    public initializeBackground(width: number, height: number, imagePath: string): void {
        const background = this.backgroundService.createBackground(width, height, imagePath, new Vector2d(0, 0));
        this.backgroundScene.addBackground(background);
    }
}
