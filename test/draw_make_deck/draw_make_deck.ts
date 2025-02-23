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
import {MakeDeckScreenCardMapRepositoryImpl} from "../../src/make_deck_screen_card/repository/MakeDeckScreenCardMapRepositoryImpl";

import {BackgroundServiceImpl} from "../../src/background/service/BackgroundServiceImpl";
import {BackgroundRepositoryImpl} from "../../src/background/repository/BackgroundRepositoryImpl";
import {MakeDeckScreenCardServiceImpl} from "../../src/make_deck_screen_card/service/MakeDeckScreenCardServiceImpl";
import {RaceButtonServiceImpl} from "../../src/race_button/service/RaceButtonServiceImpl";
import {RaceButtonEffectServiceImpl} from "../../src/race_button_effect/service/RaceButtonEffectServiceImpl";
import {CardPageMovementButtonServiceImpl} from "../../src/make_deck_card_page_movement_button/service/CardPageMovementButtonServiceImpl";
import {MakeDeckScreenDoneButtonServiceImpl} from "../../src/make_deck_screen_done_button/service/MakeDeckScreenDoneButtonServiceImpl";
import {SelectedCardBlockServiceImpl} from "../../src/selected_card_block/service/SelectedCardBlockServiceImpl";
import {SideScrollAreaServiceImpl} from "../../src/side_scroll_area/service/SideScrollAreaServiceImpl";
import {NumberOfSelectedCardsServiceImpl} from  "../../src/number_of_selected_cards/service/NumberOfSelectedCardsServiceImpl";
import {SelectedCardBlockEffectServiceImpl} from "../../src/selected_card_block_effect/service/SelectedCardBlockEffectServiceImpl";

import {RaceButtonConfigList} from "../../src/race_button/entity/RaceButtonConfigList";
import {RaceButtonEffectConfigList} from "../../src/race_button_effect/entity/RaceButtonEffectConfigList";
import {CardPageMovementButtonConfigList} from "../../src/make_deck_card_page_movement_button/entity/CardPageMovementButtonConfigList";
import {MakeDeckScreenDoneButtonConfigList} from "../../src/make_deck_screen_done_button/entity/MakeDeckScreenDoneButtonConfigList";

import {RaceButtonClickDetectService} from "../../src/race_button_click_detect/service/RaceButtonClickDetectService";
import {RaceButtonClickDetectServiceImpl} from "../../src/race_button_click_detect/service/RaceButtonClickDetectServiceImpl";
import {PageMovementButtonClickDetectService} from "../../src/make_deck_card_page_movement_button_click_detect/service/PageMovementButtonClickDetectService";
import {PageMovementButtonClickDetectServiceImpl} from "../../src/make_deck_card_page_movement_button_click_detect/service/PageMovementButtonClickDetectServiceImpl";
import {MakeDeckScreenCardClickDetectService} from "../../src/make_deck_screen_card_click_detect/service/MakeDeckScreenCardClickDetectService";
import {MakeDeckScreenCardClickDetectServiceImpl} from "../../src/make_deck_screen_card_click_detect/service/MakeDeckScreenCardClickDetectServiceImpl";
import {SideScrollAreaDetectService} from "../../src/side_scroll_area_detect/service/SideScrollAreaDetectService";
import {SideScrollAreaDetectServiceImpl} from "../../src/side_scroll_area_detect/service/SideScrollAreaDetectServiceImpl";
import {SideScrollService} from "../../src/side_scroll/service/SideScrollService";
import {SideScrollServiceImpl} from "../../src/side_scroll/service/SideScrollServiceImpl";
import {MakeDeckScreenDoneButtonClickDetectService} from "../../src/make_deck_screen_done_button_click_detect/service/MakeDeckScreenDoneButtonClickDetectService";
import {MakeDeckScreenDoneButtonClickDetectServiceImpl} from "../../src/make_deck_screen_done_button_click_detect/service/MakeDeckScreenDoneButtonClickDetectServiceImpl";
import {SelectedCardBlockHoverDetectService} from "../../src/selected_card_block_hover_detect/service/SelectedCardBlockHoverDetectService";
import {SelectedCardBlockHoverDetectServiceImpl} from "../../src/selected_card_block_hover_detect/service/SelectedCardBlockHoverDetectServiceImpl";

import {CardStateManager} from "../../src/make_deck_screen_card_manager/CardStateManager";
import {CardCountManager} from "../../src/make_deck_screen_card_manager/CardCountManager";

export class TCGJustTestMakeDeckView {
    private static instance: TCGJustTestMakeDeckView | null = null;

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
    private makeDeckScreenCardService = MakeDeckScreenCardServiceImpl.getInstance();
    private raceButtonService = RaceButtonServiceImpl.getInstance();
    private raceButtonEffectService = RaceButtonEffectServiceImpl.getInstance();
    private cardPageMovementButtonService = CardPageMovementButtonServiceImpl.getInstance();
    private makeDeckScreenDoneButtonService = MakeDeckScreenDoneButtonServiceImpl.getInstance();
    private selectedCardBlockService = SelectedCardBlockServiceImpl.getInstance();
    private sideScrollAreaService = SideScrollAreaServiceImpl.getInstance();
    private numberOfSelectedCardsService = NumberOfSelectedCardsServiceImpl.getInstance();
    private selectedCardBlockEffectService = SelectedCardBlockEffectServiceImpl.getInstance();

    private raceButtonClickDetectService: RaceButtonClickDetectService;
    private pageMovementButtonClickDetectService: PageMovementButtonClickDetectService;
    private makeDeckScreenCardClickDetectService: MakeDeckScreenCardClickDetectService;
//     private sideScrollAreaDetectService: SideScrollAreaDetectService;
//     private sideScrollService: SideScrollService;
    private makeDeckScreenDoneButtonClickDetectService: MakeDeckScreenDoneButtonClickDetectService;
    private selectedCardBlockHoverDetectService: SelectedCardBlockHoverDetectService;

    private cardStateManager = CardStateManager.getInstance();
    private cardCountManager = CardCountManager.getInstance();
    private makeDeckScreenCardMapRepository = MakeDeckScreenCardMapRepositoryImpl.getInstance();

    private readonly windowSceneRepository = WindowSceneRepositoryImpl.getInstance();
    private readonly windowSceneService = WindowSceneServiceImpl.getInstance(this.windowSceneRepository);

    private readonly cameraRepository = CameraRepositoryImpl.getInstance();
    private readonly cameraService = CameraServiceImpl.getInstance(this.cameraRepository);

    private initialized = false;
    private isAnimating = false;
    private isSideScrollAreaAdded = false;
    private blockAddedMap: Map<number, boolean> = new Map();

    private userWindowSize: UserWindowSize;

    constructor(simulationMyDeckContainer: HTMLElement) {
        this.simulationMyDeckContainer = simulationMyDeckContainer;
        this.scene = this.windowSceneService.createScene('make-deck')
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

        this.raceButtonClickDetectService = RaceButtonClickDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousedown', (e) => this.raceButtonClickDetectService.onMouseDown(e), false);

        this.pageMovementButtonClickDetectService = PageMovementButtonClickDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousedown', (e) => this.pageMovementButtonClickDetectService.onMouseDown(e), false);

        this.makeDeckScreenCardClickDetectService = MakeDeckScreenCardClickDetectServiceImpl.getInstance(this.camera, this.scene);
//         this.renderer.domElement.addEventListener('mousedown', (e) => this.makeDeckScreenCardClickDetectService.onMouseDown(e), false);
        this.renderer.domElement.addEventListener('mousedown', async (e) => {
            const clickCard = await this.makeDeckScreenCardClickDetectService.onMouseDown(e);
            const clickedCardId = this.makeDeckScreenCardClickDetectService.getCurrentClickedCardId();
            if (clickCard && clickedCardId) {
                const cardClickCount = this.cardCountManager.getCardClickCount(clickedCardId);
                if (!this.isSideScrollAreaAdded) {
                    await this.addSideScrollArea();
                    this.isSideScrollAreaAdded = true;
                }
                if (cardClickCount == 1 && !this.blockAddedMap.get(clickedCardId)) {
                    await this.addBlock(clickedCardId);
                    this.blockAddedMap.set(clickedCardId, true);
                }
                await this.addNumberOfSelectedCards(clickedCardId);
                await this.deleteDoneButton();
            }
        }, false);

//         this.sideScrollAreaDetectService = SideScrollAreaDetectServiceImpl.getInstance(this.camera, this.scene);
//         this.renderer.domElement.addEventListener('mousemove', (e) => this.sideScrollAreaDetectService.onMouseMove(e), false);

//         this.sideScrollService = SideScrollServiceImpl.getInstance(this.camera, this.scene, this.renderer);
//         this.renderer.domElement.addEventListener('wheel', (e) => this.sideScrollService.onWheelScroll(e), false);

        this.makeDeckScreenDoneButtonClickDetectService = MakeDeckScreenDoneButtonClickDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousedown', (e) => this.makeDeckScreenDoneButtonClickDetectService.onMouseDown(e), false);

        this.selectedCardBlockHoverDetectService = SelectedCardBlockHoverDetectServiceImpl.getInstance(this.camera, this.scene);
        this.renderer.domElement.addEventListener('mousemove', (e) => this.selectedCardBlockHoverDetectService.onMouseOver(e), false);
    }

    public static getInstance(simulationMyDeckContainer: HTMLElement): TCGJustTestMakeDeckView {
        if (!TCGJustTestMakeDeckView.instance) {
            TCGJustTestMakeDeckView.instance = new TCGJustTestMakeDeckView(simulationMyDeckContainer);
        }
        return TCGJustTestMakeDeckView.instance;
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

        console.log('TCGJustTestMakeDeckView initialize() operate!!!');
        await this.textureManager.preloadTextures("image-paths.json");
        console.log("Textures preloaded. Adding background and buttons...");

        await this.addBackground();
        await this.addCards();
        await this.addRaceButton();
        await this.addRaceButtonEffect();
        await this.addCardPageMovementButton();
        await this.addDoneButton();
//         await this.addSideScrollArea();
//         this.addBlock();

        this.initialized = true;
        this.isAnimating = true;

        this.animate();
    }

    public show(): void {
        console.log('Showing TCGJustTestMakeDeckView...');
        this.renderer.domElement.style.display = 'block';
        this.simulationMyDeckContainer.style.display = 'block';
        this.isAnimating = true;
        if (!this.initialized) {
            this.initialize();
        } else {
            this.animate();
        }
    }

    public hide(): void {
        console.log('Hiding TCGJustTestMakeDeckView...');
        this.isAnimating = false;
        this.renderer.domElement.style.display = 'none';
        this.simulationMyDeckContainer.style.display = 'none';
    }

    private async addBackground(): Promise<void> {
        try {
            const background = await this.backgroundService.createBackground(
                'make_deck_background',
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
            // To-do:예시 데이터 Map 만들어야 함.
            const cardMap = this.makeDeckScreenCardMapRepository.getCurrentMakeDeckScreenCardMap();
            const cardIdList = this.makeDeckScreenCardMapRepository.getCardIdList();
            const cardGroup = await this.makeDeckScreenCardService.createMakeDeckScreenCardWithPosition(cardMap);

            if (cardGroup) {
                this.cardStateManager.initializeCardVisibility(cardIdList);
                this.scene.add(cardGroup);
            }

        } catch (error) {
            console.error('Failed to add cards:', error);
        }
    }

    private async addRaceButton(): Promise<void> {
        try {
            const configList = new RaceButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) =>{
                const button = await this.raceButtonService.createRaceButton(
                    config.id,
                    config.position
                );

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
            const configList = new RaceButtonEffectConfigList();
            await Promise.all(configList.effectConfigs.map(async (config) =>{
                const effect = await this.raceButtonEffectService.createRaceButtonEffect(
                    config.id,
                    config.position
                );

                if (effect) {
                    this.raceButtonEffectService.initializeRaceButtonEffectVisible();
                    this.scene.add(effect);
                    console.log(`Draw Race Button Effect: ${config.id}`);
                }
            }));
        } catch (error) {
            console.error('Failed to add Race Button Effect:', error);
        }
    }

    private async addCardPageMovementButton(): Promise<void> {
        try {
            const configList = new CardPageMovementButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) =>{
                const button = await this.cardPageMovementButtonService.createCardPageMovementButton(
                    config.id,
                    config.position
                );

                if (button) {
                    this.scene.add(button);
                    console.log(`Draw Card Page Movement Button ${config.id}`);
                }
            }));
        } catch (error) {
            console.error('Failed to add Card Page Movement Button:', error);
        }
    }

    private async addDoneButton(): Promise<void> {
        try {
            const configList = new MakeDeckScreenDoneButtonConfigList();
            await Promise.all(configList.buttonConfigs.map(async (config) =>{
                const button = await this.makeDeckScreenDoneButtonService.createDoneButton(
                    config.id,
                    config.position
                );

                if (button) {
                    this.makeDeckScreenDoneButtonService.initializeDoneButtonVisible();
                    const allButtons = this.makeDeckScreenDoneButtonService.getAllDoneButtons();
                    allButtons.forEach((button) => this.scene.add(button.getMesh()));
//                     this.scene.add(button);
                    console.log(`Draw Done Button ${config.id}`);
                }
            }));
        } catch (error) {
            console.error('Failed to add Done Button:', error);
        }
    }

    private async deleteDoneButton(): Promise<void> {
        try {
            const totalSelectedCardCount = this.cardCountManager.findTotalSelectedCardCount();
            const deactivationDoneButton = this.makeDeckScreenDoneButtonService.getDoneButtonById(0);
            if (deactivationDoneButton && totalSelectedCardCount == 40) {
                this.scene.remove(deactivationDoneButton.getMesh());
                this.makeDeckScreenDoneButtonService.deleteDoneButtonById(0);
            }
        } catch (error) {
            console.error('Failed to delete Done Button:', error);
        }
    }

    private async addBlock(cardId: number): Promise<void> {
        try {
//             const cardId = 2;
            const blockGroup = await this.selectedCardBlockService.createSelectedCardBlockWithPosition(cardId);

            if (blockGroup && blockGroup.children.length > 0) {
//                 const blockMesh = blockGroup.children[0] as THREE.Mesh;
//                 const sideScrollArea = this.sideScrollService.getSideScrollArea();
//                 if (sideScrollArea) {
//                     const clippingPlanes = this.sideScrollService.setClippingPlanes(sideScrollArea);
//                     if (Array.isArray(blockMesh.material)) {
//                         blockMesh.material.forEach((material) => {
//                             if (material instanceof THREE.Material) {
//                                 material.clippingPlanes = clippingPlanes;
//                             }
//                         });
//                     } else if (blockMesh.material instanceof THREE.Material) {
//                         // 배열이 아니면, 단일 Material로 취급하여 처리
//                         blockMesh.material.clippingPlanes = clippingPlanes;
//                     }
//                 }
                this.scene.add(blockGroup);
            }

        } catch (error) {
            console.error('Failed to add Block:', error);
        }
    }

    private async addBlockEffect(cardId: number): Promise<void> {
        try {
            const effectGroup = await this.selectedCardBlockEffectService.createSelectedCardBlockEffectWithPosition(cardId);

            if (effectGroup && effectGroup.children.length > 0) {
                this.scene.add(effectGroup);
            }

        } catch (error) {
            console.error('Failed to add Effect:', error);
        }
    }

    private async addSideScrollArea(): Promise<void> {
        try{
            const areaMesh = await this.sideScrollAreaService.createSideScrollArea();
            if (areaMesh) {
                this.scene.add(areaMesh);
            } else {
                console.warn(`No Side Scroll Area Mesh found`);
            }

        } catch (error) {
            console.error('Failed to add Side Scroll Area:', error);
        }
    }

    private async addNumberOfSelectedCards(cardId: number): Promise<void> {

        try {
            // 기존 Mesh 제거
            const existingMesh = this.numberOfSelectedCardsService.getExistingNumberObjectMeshByCardId(cardId);
            if (existingMesh) {
                console.log(`existing Number Mesh (ID: ${cardId})`);
                this.scene.remove(existingMesh);
            }

            await this.numberOfSelectedCardsService.createNumberOfSelectedCardsWithPosition(cardId);
            const newNumberMesh = this.numberOfSelectedCardsService.getNumberObjectMeshByCardId(cardId);
            if (newNumberMesh) {
                this.scene.add(newNumberMesh);
            }

        } catch (error) {
            console.error('Failed to add number of selected cards:', error);
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
            this.makeDeckScreenCardService.adjustMakeDeckScreenCardPosition();
            this.raceButtonService.adjustRaceButtonPosition();
            this.raceButtonEffectService.adjustRaceButtonEffectPosition();
            this.cardPageMovementButtonService.adjustCardPageMovementButtonPosition();
            this.makeDeckScreenDoneButtonService.adjustDoneButtonPosition();
            this.selectedCardBlockService.adjustSelectedCardBlockPosition();
            this.selectedCardBlockEffectService.adjustSelectedCardBlockEffectPosition();
            this.sideScrollAreaService.adjustSideScrollAreaPosition();
            this.numberOfSelectedCardsService.adjustNumberOfSelectedCardsPosition();
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

const fieldView = TCGJustTestMakeDeckView.getInstance(rootElement);
fieldView.initialize();