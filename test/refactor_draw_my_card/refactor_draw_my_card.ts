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
import {SideScrollAreaServiceImpl} from "../../src/side_scroll_area/service/SideScrollAreaServiceImpl";
import {MyCardScreenCardEffectServiceImpl} from "../../src/my_card_screen_card_effect/service/MyCardScreenCardEffectServiceImpl";

import {MyCardRaceButtonConfigList} from "../../src/my_card_race_button/entity/MyCardRaceButtonConfigList";
import {MyCardRaceButtonEffectConfigList} from "../../src/my_card_race_button_effect/entity/MyCardRaceButtonEffectConfigList";
import {MyCardScreenCardMapRepositoryImpl} from "../../src/my_card_screen_card/repository/MyCardScreenCardMapRepositoryImpl";
import {ClippingMaskManager} from "../../src/clipping_mask_manager/ClippingMaskManager";

import {MyCardRaceButtonClickDetectService} from "../../src/my_card_race_button_click_detect/service/MyCardRaceButtonClickDetectService";
import {MyCardRaceButtonClickDetectServiceImpl} from "../../src/my_card_race_button_click_detect/service/MyCardRaceButtonClickDetectServiceImpl";
import {SideScrollAreaDetectService} from "../../src/side_scroll_area_detect/service/SideScrollAreaDetectService";
import {SideScrollAreaDetectServiceImpl} from "../../src/side_scroll_area_detect/service/SideScrollAreaDetectServiceImpl";
import {MyCardScreenScrollService} from "../../src/my_card_screen_scroll/service/MyCardScreenScrollService";
import {MyCardScreenScrollServiceImpl} from "../../src/my_card_screen_scroll/service/MyCardScreenScrollServiceImpl";
import {MyCardScreenCardHoverDetectService} from "../../src/my_card_screen_card_hover_detect/service/MyCardScreenCardHoverDetectService";
import {MyCardScreenCardHoverDetectServiceImpl} from "../../src/my_card_screen_card_hover_detect/service/MyCardScreenCardHoverDetectServiceImpl";

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
    private sideScrollAreaService = SideScrollAreaServiceImpl.getInstance();
    private myCardScreenCardEffectService = MyCardScreenCardEffectServiceImpl.getInstance();

    private myCardRaceButtonClickDetectService: MyCardRaceButtonClickDetectService;
    private sideScrollAreaDetectService: SideScrollAreaDetectService;
    private myCardScreenScrollService: MyCardScreenScrollService;
    private myCardScreenCardHoverDetectService: MyCardScreenCardHoverDetectService;

    private myCardScreenCardMapRepository = MyCardScreenCardMapRepositoryImpl.getInstance();
    private clippingMaskManager = ClippingMaskManager.getInstance();

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
        this.clippingMaskManager.setRenderer(this.renderer);

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

        this.sideScrollAreaDetectService = SideScrollAreaDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousemove', (e) => this.sideScrollAreaDetectService.onMouseMoveMyCard(e), false);

        this.myCardScreenScrollService = MyCardScreenScrollServiceImpl.getInstance(this.camera, this.scene, this.renderer);
        this.renderer.domElement.addEventListener('wheel', async (e) => {
            const scrollAreaDetect = this.sideScrollAreaDetectService.getMyCardScrollEnabled();
            const clickedRaceButtonId = this.myCardScreenScrollService.getCurrentClickedRaceButtonId();
            if (scrollAreaDetect == true && clickedRaceButtonId !== null) {
                if (this.myCardScreenScrollService.getCardCountByRaceId(clickedRaceButtonId) > 10) {
                    this.myCardScreenScrollService.onWheelScroll(e, clickedRaceButtonId);
                }
            }
        }, false);

        this.myCardScreenCardHoverDetectService = MyCardScreenCardHoverDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousemove', (e) => this.myCardScreenCardHoverDetectService.onMouseMove(e), false);
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
        await this.addScrollArea();
        await this.addCards();
        await this.addCardEffects();

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
            await this.myCardScreenCardService.createMyCardScreenCardWithPosition(cardMap);

            const card = this.myCardScreenCardService.getAllCard();
            const humanCardGroup = this.myCardScreenCardService.getHumanCardGroups();
            const undeadCardGroup = this.myCardScreenCardService.getUndeadCardGroups();
            const trentCardGroup = this.myCardScreenCardService.getTrentCardGroups();

            const scrollArea = this.sideScrollAreaService.getSideScrollAreaByTypeAndId(2, 0);
            let clippingPlanes: THREE.Plane[] = [];

            if (scrollArea) {
                clippingPlanes = this.clippingMaskManager.setClippingPlanes(1, scrollArea);
            }
            this.myCardScreenCardService.initializeCardVisibility();

            const cardGroups = [humanCardGroup, undeadCardGroup, trentCardGroup];
            cardGroups.forEach((cardGroup) => {
                cardGroup.children.forEach((cardObject) => {
                    if (cardObject instanceof THREE.Mesh) {
                        this.clippingMaskManager.applyClippingPlanesToMesh(cardObject, clippingPlanes);
                    } else {
                        console.warn("[WARN] Skipping non-mesh object in cardGroup:", cardObject);
                    }
                });

                if (!this.scene.children.includes(cardGroup)) {
                    this.scene.add(cardGroup);
                }
                cardGroup.position.y = 0;
            });

//             if (cardGroup) {
//                 this.myCardScreenCardService.initializeCardVisibility();
// //                 this.myCardScreenCardService.initializeCardVisibility(cardIdList);
//                 this.scene.add(cardGroup);
//             }

        } catch (error) {
            console.error('Failed to add cards:', error);
        }
    }

    private async addCardEffects(): Promise<void> {
        try {
            const cardMap = this.myCardScreenCardMapRepository.getCurrentMyCardScreenCardMap();
            const cardIdList = this.myCardScreenCardMapRepository.getCardIdList();
            await this.myCardScreenCardEffectService.createMyCardScreenCardEffectWithPosition(cardMap);

            const effect = this.myCardScreenCardEffectService.getAllCardEffect();
            const humanEffectGroup = this.myCardScreenCardEffectService.getHumanEffectGroups();
            const undeadEffectGroup = this.myCardScreenCardEffectService.getUndeadEffectGroups();
            const trentEffectGroup = this.myCardScreenCardEffectService.getTrentEffectGroups();
            const scrollArea = this.sideScrollAreaService.getSideScrollAreaByTypeAndId(2, 0);
            let clippingPlanes: THREE.Plane[] = [];

            if (scrollArea) {
                clippingPlanes = this.clippingMaskManager.setClippingPlanes(1, scrollArea);
            }
            this.myCardScreenCardEffectService.initializeCardEffectVisibility();

            const effectGroups = [humanEffectGroup, undeadEffectGroup, trentEffectGroup];
            effectGroups.forEach((effectGroup) => {
                effectGroup.children.forEach((effectObject) => {
                    if (effectObject instanceof THREE.Mesh) {
                        this.clippingMaskManager.applyClippingPlanesToMesh(effectObject, clippingPlanes);
                    } else {
                        console.warn("[WARN] Skipping non-mesh object in effectGroup:", effectObject);
                    }
                });

                if (!this.scene.children.includes(effectGroup)) {
                    this.scene.add(effectGroup);
                }
                effectGroup.position.y = 0;
            });
//
//             if (effectGroup) {
//                 this.myCardScreenCardEffectService.initializeCardEffectVisibility();
//                 this.scene.add(effectGroup);
//             }

        } catch (error) {
            console.error('Failed to add card effects:', error);
        }
    }

    private async addRaceButton(): Promise<void> {
        try {
            const configList = new MyCardRaceButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) => {
                const button = await this.myCardRaceButtonService.createRaceButton(config.id,config.position);

                if (button) {
                    this.myCardRaceButtonService.initializeRaceButtonVisible();
                    this.myCardRaceButtonService.saveCurrentClickedRaceButtonId(0);
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

    private async addScrollArea(): Promise<void> {
        try{
            const areaMesh = await this.sideScrollAreaService.createSideScrollArea('myCardSideScrollArea', 2, 0.735, 0.8285, 0.013, -0.02);
            if (areaMesh) {
                this.scene.add(areaMesh);
            } else {
                console.warn(`No Side Scroll Area Mesh found`);
            }

        } catch (error) {
            console.error('Failed to add Side Scroll Area:', error);
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
            this.myCardScreenCardService.adjustMyCardScreenCardPosition();
            this.myCardScreenCardEffectService.adjustMyCardScreenCardEffectPosition();
            this.sideScrollAreaService.adjustMyCardSideScrollAreaPosition();

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