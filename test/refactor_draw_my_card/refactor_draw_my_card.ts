import * as THREE from 'three';
import myCardMusic from '@resource/music/my_card/my-card.mp3';

import {TextureManager} from "../../src/texture_manager/TextureManager";
import {NonBackgroundImage} from "../../src/shape/image/NonBackgroundImage";
import {AudioController} from "../../src/audio/AudioController";
import {MouseController} from "../../src/mouse/MouseController";

import {UserWindowSize} from "../../src/window_size/WindowSize"
import {WindowSceneServiceImpl} from "../../src/window_scene/service/WindowSceneServiceImpl";
import {WindowSceneRepositoryImpl} from "../../src/window_scene/repository/WindowSceneRepositoryImpl";
import {CameraServiceImpl} from "../../src/camera/service/CameraServiceImpl";
import {CameraRepositoryImpl} from "../../src/camera/repository/CameraRepositoryImpl";

import {BackgroundServiceImpl} from "../../src/background/service/BackgroundServiceImpl";
import {BackgroundRepositoryImpl} from "../../src/background/repository/BackgroundRepositoryImpl";
import {MyCardRaceButtonServiceImpl} from "../../src/my_card_race_button/service/MyCardRaceButtonServiceImpl";
import {MyCardRaceButtonEffectServiceImpl} from "../../src/my_card_race_button_effect/service/MyCardRaceButtonEffectServiceImpl";
import {MyCardScreenCardServiceImpl} from "../../src/my_card_screen_card/service/MyCardScreenCardServiceImpl";

import {MyCardRaceButtonConfigList} from "../../src/my_card_race_button/entity/MyCardRaceButtonConfigList";
import {MyCardRaceButtonEffectConfigList} from "../../src/my_card_race_button_effect/entity/MyCardRaceButtonEffectConfigList";
import {MyCardScreenCardMapRepositoryImpl} from "../../src/my_card_screen_card/repository/MyCardScreenCardMapRepositoryImpl";

import {MyCardRaceButtonClickDetectService} from "../../src/my_card_race_button_click_detect/service/MyCardRaceButtonClickDetectService";
import {MyCardRaceButtonClickDetectServiceImpl} from "../../src/my_card_race_button_click_detect/service/MyCardRaceButtonClickDetectServiceImpl";

export class TCGJustTestMyCardView {
    private static instance: TCGJustTestMyCardView | null = null;

    private scene: THREE.Scene;
    private cameraId: number;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private simulationMyCardContainer: HTMLElement;

    private audioController: AudioController;
    private mouseController: MouseController;

    private background: NonBackgroundImage | null = null;
    private backgroundService = BackgroundServiceImpl.getInstance();

    private myCardRaceButtonService = MyCardRaceButtonServiceImpl.getInstance();
    private myCardRaceButtonEffectService = MyCardRaceButtonEffectServiceImpl.getInstance();
    private myCardScreenCardService = MyCardScreenCardServiceImpl.getInstance();

    private myCardRaceButtonClickDetectService: MyCardRaceButtonClickDetectService;

    private myCardScreenCardMapRepository = MyCardScreenCardMapRepositoryImpl.getInstance();

    private readonly windowSceneRepository = WindowSceneRepositoryImpl.getInstance();
    private readonly windowSceneService = WindowSceneServiceImpl.getInstance(this.windowSceneRepository);

    private readonly cameraRepository = CameraRepositoryImpl.getInstance();
    private readonly cameraService = CameraServiceImpl.getInstance(this.cameraRepository);

    private initialized = false;
    private isAnimating = false;
    private userWindowSize: UserWindowSize;

    constructor(simulationMyCardContainer: HTMLElement) {
        this.simulationMyCardContainer = simulationMyCardContainer;
        this.scene = this.windowSceneService.createScene('my-card')
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.simulationMyCardContainer.appendChild(this.renderer.domElement);

        this.userWindowSize = UserWindowSize.getInstance()

        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = window.innerHeight;
        const cameraObject = this.cameraService.createCamera(aspect, viewSize)
        this.cameraId = cameraObject.getId()
        this.camera = cameraObject.getCamera()

        this.cameraService.setCameraPosition(this.cameraId, 0, 0, 5)
        this.cameraService.setCameraLookAt(this.cameraId, 0, 0, 0)

        this.textureManager = TextureManager.getInstance();
        this.audioController = AudioController.getInstance();
        this.audioController.setMusic(myCardMusic);

        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.mouseController = new MouseController(this.camera, this.scene);
        window.addEventListener('click', () => this.initializeAudio(), { once: true });

        this.myCardRaceButtonClickDetectService = MyCardRaceButtonClickDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousedown', (e) => this.myCardRaceButtonClickDetectService.onMouseDown(e), false);
    }

    public static getInstance(simulationMyCardContainer: HTMLElement): TCGJustTestMyCardView {
        if (!TCGJustTestMyCardView.instance) {
            TCGJustTestMyCardView.instance = new TCGJustTestMyCardView(simulationMyCardContainer);
        }
        return TCGJustTestMyCardView.instance;
    }

    private async initializeAudio(): Promise<void> {
        try {
            await this.audioController.playMusic();
        } catch (error) {
            console.error('Initial audio play failed:', error);
        }
    }

    public async initialize(): Promise<void> {
        if (this.initialized) {
            console.log('Already initialized');
            this.show();
            return;
        }

        console.log('TCGJustTestMyCardView initialize() operate!!!');
        await this.textureManager.preloadTextures("image-paths.json");
        console.log("Textures preloaded. Adding background and buttons...");

        await this.addBackground();
        await this.addRaceButton();
        await this.addRaceButtonEffect();
        await this.addCards();

        this.initialized = true;
        this.isAnimating = true;

        this.animate();
    }

    public show(): void {
        console.log('Showing TCGJustTestMyCardView...');
        this.renderer.domElement.style.display = 'block';
        this.simulationMyCardContainer.style.display = 'block';
        this.isAnimating = true;
        if (!this.initialized) {
            this.initialize();
        } else {
            this.animate();
        }
    }

    public hide(): void {
        console.log('Hiding TCGJustTestMyCardView...');
        this.isAnimating = false;
        this.renderer.domElement.style.display = 'none';
        this.simulationMyCardContainer.style.display = 'none';
    }

    private async addBackground(): Promise<void> {
        try {
            const background = await this.backgroundService.createBackground(
                'my_card_background',
                1, // BackgroundType 값
                window.innerWidth,
                window.innerHeight
            );

            this.background = background;
            if (this.background instanceof NonBackgroundImage) {
                this.background.draw(this.scene);
            }
        } catch (error) {
            console.error('Failed to add background:', error);
        }
    }

    private async addCards(): Promise<void> {
        try {
            const cardMap = this.myCardScreenCardMapRepository.getCurrentMyCardScreenCardMap();
            const cardIdList = this.myCardScreenCardMapRepository.getCardIdList();
            const cardGroup = await this.myCardScreenCardService.createMyCardScreenCardWithPosition(cardMap);

            if (cardGroup) {
                this.scene.add(cardGroup);
            }

        } catch (error) {
            console.error('Failed to add cards:', error);
        }
    }

    private async addRaceButton(): Promise<void> {
        try {
            const configList = new MyCardRaceButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) => {
                const button = await this.myCardRaceButtonService.createRaceButton(config.id,config.position);

                if (button) {
                    this.scene.add(button);
                    console.log(`Draw Race Button ${config.id}`);
                }
            }));
        } catch (error) {
            console.error('Failed to add Race Button:', error);
        }
    }

    private async addRaceButtonEffect(): Promise<void> {
        try {
            const configList = new MyCardRaceButtonEffectConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) => {
                const effect = await this.myCardRaceButtonEffectService.createRaceButtonEffect(config.id,config.position);

                if (effect) {
                    this.myCardRaceButtonEffectService.initializeRaceButtonEffectVisible();
                    this.scene.add(effect);
                    console.log(`Draw Race Button Effect ${config.id}`);
                }
            }));
        } catch (error) {
            console.error('Failed to add Race Button Effect:', error);
        }
    }

    private onWindowResize(): void {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // 기존 크기와 비교해서 변경된 경우만 처리
        if (newWidth !== this.userWindowSize.getWidth() || newHeight !== this.userWindowSize.getHeight()) {
            const aspect = newWidth / newHeight;
            const viewSize = newHeight;

            this.cameraService.updateCamera(this.cameraId, aspect, viewSize)
            this.renderer.setSize(newWidth, newHeight);

            if (this.background) {
                const scaleX = newWidth / this.background.getWidth();
                const scaleY = newHeight / this.background.getHeight();
                this.background.setScale(scaleX, scaleY);
            }

            this.userWindowSize.calculateScaleFactors(newWidth, newHeight);
            const { scaleX, scaleY } = this.userWindowSize.getScaleFactors();
            this.myCardRaceButtonService.adjustRaceButtonPosition();
            this.myCardRaceButtonEffectService.adjustRaceButtonEffectPosition();

        }
    }


    animate(): void {
        if (this.isAnimating) {
            requestAnimationFrame(() => this.animate());
            this.renderer.render(this.scene, this.camera);
        } else {
            console.log('Animation stopped.');
        }
    }
}


const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error("Cannot find element with id 'app'.");
}

const fieldView = TCGJustTestMyCardView.getInstance(rootElement);
fieldView.initialize();