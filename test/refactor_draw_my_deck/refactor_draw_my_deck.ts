import * as THREE from 'three';
import myCardMusic from '@resource/music/my_card/my-card.mp3';

import {TextureManager} from "../../src/texture_manager/TextureManager";
import {NonBackgroundImage} from "../../src/shape/image/NonBackgroundImage";
import { AudioController } from "../../src/audio/AudioController";
import {MouseController} from "../../src/mouse/MouseController";

import {UserWindowSize} from "../../src/window_size/WindowSize"
import {WindowSceneServiceImpl} from "../../src/window_scene/service/WindowSceneServiceImpl";
import {WindowSceneRepositoryImpl} from "../../src/window_scene/repository/WindowSceneRepositoryImpl";
import {CameraServiceImpl} from "../../src/camera/service/CameraServiceImpl";
import {CameraRepositoryImpl} from "../../src/camera/repository/CameraRepositoryImpl";

import {BackgroundServiceImpl} from "../../src/background/service/BackgroundServiceImpl";
import {BackgroundRepositoryImpl} from "../../src/background/repository/BackgroundRepositoryImpl";

import {MyDeckCardPageMovementButtonServiceImpl} from "../../src/my_deck_card_page_movement_button/service/MyDeckCardPageMovementButtonServiceImpl";
import {MyDeckCardPageMovementButtonRepositoryImpl} from "../../src/my_deck_card_page_movement_button/repository/MyDeckCardPageMovementButtonRepositoryImpl";
import {MyDeckButtonPageMovementButtonServiceImpl} from "../../src/my_deck_button_page_movement_button/service/MyDeckButtonPageMovementButtonServiceImpl";
import {MyDeckButtonPageMovementButtonRepositoryImpl} from "../../src/my_deck_button_page_movement_button/repository/MyDeckButtonPageMovementButtonRepositoryImpl";
import {MyDeckCardPageMovementButtonConfigList} from "../../src/my_deck_card_page_movement_button/entity/MyDeckCardPageMovementButtonConfigList";
import {MyDeckButtonPageMovementButtonConfigList} from "../../src/my_deck_button_page_movement_button/entity/MyDeckButtonPageMovementButtonConfigList";
import {MyDeckButtonServiceImpl} from "../../src/my_deck_button/service/MyDeckButtonServiceImpl";
import {MyDeckButtonMapRepositoryImpl} from "../../src/my_deck_button/repository/MyDeckButtonMapRepositoryImpl";
import {MyDeckButtonSceneRepositoryImpl} from "../../src/my_deck_button_scene/repository/MyDeckButtonSceneRepositoryImpl";
import {MyDeckButtonClickDetectServiceImpl} from "../../src/deck_button_click_detect/service/MyDeckButtonClickDetectServiceImpl";
import {MyDeckButtonClickDetectService} from "../../src/deck_button_click_detect/service/MyDeckButtonClickDetectService";

export class TCGJustTestMyDeckView {
    private static instance: TCGJustTestMyDeckView | null = null;

    private scene: THREE.Scene;
    private cameraId: number;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private simulationMyDeckContainer: HTMLElement;

    private audioController: AudioController;
    private mouseController: MouseController;

    private background: NonBackgroundImage | null = null;
    private backgroundService = BackgroundServiceImpl.getInstance();

    private myDeckCardPageMovementButtonService = MyDeckCardPageMovementButtonServiceImpl.getInstance();
    private myDeckButtonPageMovementButtonService = MyDeckButtonPageMovementButtonServiceImpl.getInstance();
    private myDeckButtonService = MyDeckButtonServiceImpl.getInstance();
    private myDeckButtonMapRepository = MyDeckButtonMapRepositoryImpl.getInstance();

    private readonly windowSceneRepository = WindowSceneRepositoryImpl.getInstance();
    private readonly windowSceneService = WindowSceneServiceImpl.getInstance(this.windowSceneRepository);

    private readonly cameraRepository = CameraRepositoryImpl.getInstance();
    private readonly cameraService = CameraServiceImpl.getInstance(this.cameraRepository);

    private myDeckButtonClickDetectService: MyDeckButtonClickDetectService
    private myDeckButtonSceneRepository = MyDeckButtonSceneRepositoryImpl.getInstance();

    private initialized = false;
    private isAnimating = false;

    private userWindowSize: UserWindowSize;

    constructor(simulationMyDeckContainer: HTMLElement) {
        this.simulationMyDeckContainer = simulationMyDeckContainer;
        this.scene = this.windowSceneService.createScene('my-deck')
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.simulationMyDeckContainer.appendChild(this.renderer.domElement);

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

        this.myDeckButtonClickDetectService = MyDeckButtonClickDetectServiceImpl.getInstance(this.camera, this.scene);

//         this.renderer.domElement.addEventListener('mousedown', async (e) => {
//             if (e.button === 0) {
//                 const clickPoint = { x: e.clientX, y: e.clientY };
//                 await this.myDeckButtonClickDetectService.handleLeftClick(clickPoint);
//             }
//         });

        this.renderer.domElement.addEventListener('mousedown', async (e: MouseEvent) => {
            if (e.button === 0) {
                await this.myDeckButtonClickDetectService.handleLeftClick(e, (clickedDeckButton) => {
                    const buttonHide = this.myDeckButtonService.hideMyDeckButtonById(clickedDeckButton.id);
                    if (buttonHide) {
                        console.log(`Deck Button ID ${clickedDeckButton.id} is now hidden.`);
                    } else {
                        console.error(`Failed to hide Deck Button ID ${clickedDeckButton.id}`);
                    }
                });
            }
        });

    }

    public static getInstance(simulationMyDeckContainer: HTMLElement): TCGJustTestMyDeckView {
        if (!TCGJustTestMyDeckView.instance) {
            TCGJustTestMyDeckView.instance = new TCGJustTestMyDeckView(simulationMyDeckContainer);
        }
        return TCGJustTestMyDeckView.instance;
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

        console.log('TCGJustTestMyDeckView initialize() operate!!!');
        await this.textureManager.preloadTextures("image-paths.json");

        console.log("Textures preloaded. Adding background and buttons...");

        await this.addBackground();
        await this.addMyDeckButtonPageMovementButton();
        this.addMyDeckCardPageMovementButton();
        this.addMyDeckButton();

        this.initialized = true;
        this.isAnimating = true;

        this.animate();
    }

    public show(): void {
        console.log('Showing TCGJustTestMyDeckView...');
        this.renderer.domElement.style.display = 'block';
        this.simulationMyDeckContainer.style.display = 'block';
        this.isAnimating = true;
        if (!this.initialized) {
            this.initialize(); // 초기화되지 않은 경우 초기화 호출
        } else {
            this.animate(); // 이미 초기화된 경우 애니메이션만 다시 시작
        }
    }

    public hide(): void {
        console.log('Hiding TCGJustTestMyDeckView...');
        this.isAnimating = false;
        this.renderer.domElement.style.display = 'none';
        this.simulationMyDeckContainer.style.display = 'none';
    }

    private async addBackground(): Promise<void> {
        try {
            const background = await this.backgroundService.createBackground(
                'my_deck_background',
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

    private async addMyDeckCardPageMovementButton(): Promise<void> {
        try {
            const configList = new MyDeckCardPageMovementButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) =>{
                    const button = await this.myDeckCardPageMovementButtonService.createMyDeckCardPageMovementButton(
                        config.id,
                        config.position
                    );

                    if (button) {
                        this.scene.add(button);
                        console.log(`Draw My Deck Card Page Movement Button ${config.id}`);
                    }
                })
            );
        } catch (error) {
            console.error('Failed to add my deck card page movement button:', error);
        }
    }

    private async addMyDeckButtonPageMovementButton(): Promise<void> {
        try {
            const configList = new MyDeckButtonPageMovementButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) => {
                    const button = await this.myDeckButtonPageMovementButtonService.createMyDeckButtonPageMovementButton(
                        config.id,
                        config.position
                    );

                    if (button) {
                        this.scene.add(button);
                        console.log(`Draw My Deck Button Page Movement Button: ${config.id}`);
                    }
                })
            );
        } catch (error) {
            console.error('Failed to add my deck button page movement buttons:', error);
        }
    }

    private async addMyDeckButton(): Promise<void>{
        try {

            const myDeckButtonList = this.myDeckButtonMapRepository.getMyDeckList()
            console.log('myDeckButtonList:', myDeckButtonList)

            for (const deckId of myDeckButtonList) {
                const buttonGroup = await this.myDeckButtonService.createMyDeckButtonWithPosition(deckId);

                if (buttonGroup) {
                    this.scene.add(buttonGroup);
                }
            }

        } catch (error) {
            console.error('Failed to add my deck buttons:', error);
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
            this.myDeckButtonPageMovementButtonService.adjustMyDeckButtonPageMovementButtonPosition();
            this.myDeckCardPageMovementButtonService.adjustMyDeckCardPageMovementButtonPosition();
            this.myDeckButtonService.adjustMyDeckButtonPosition();
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

const fieldView = TCGJustTestMyDeckView.getInstance(rootElement);
fieldView.initialize();