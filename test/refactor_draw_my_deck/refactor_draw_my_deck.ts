import * as THREE from 'three';
import myCardMusic from '@resource/music/my_card/my-card.mp3';

import {TextureManager} from "../../src/texture_manager/TextureManager";
import {NonBackgroundImage} from "../../src/shape/image/NonBackgroundImage";
import { AudioController } from "../../src/audio/AudioController";
import {MouseController} from "../../src/mouse/MouseController";

import {MyDeckBackground} from "../../src/my_deck/entity/MyDeckBackground";
import {MyDeckBackgroundScene} from "../../src/my_deck/scene/MyDeckBackgroundScene";
import {UserWindowSize} from "../../src/window_size/WindowSize"
// import {WindowSceneServiceImpl} from "../../src/window_scene/service/WindowSceneServiceImpl";
// import {WindowSceneRepositoryImpl} from "../../src/window_scene/repository/WindowSceneRepositoryImpl";
// import {CameraServiceImpl} from "../../src/camera/service/CameraServiceImpl";
// import {CameraRepositoryImpl} from "../../src/camera/repository/CameraRepositoryImpl";


export class TCGJustTestMyDeckView {
    private static instance: TCGJustTestMyDeckView | null = null;

    private scene: THREE.Scene;
//     private cameraId: number;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private simulationMyDeckContainer: HTMLElement;
    private background: NonBackgroundImage | null = null;
    private audioController: AudioController;
    private mouseController: MouseController;


//     private readonly windowSceneRepository = WindowSceneRepositoryImpl.getInstance();
//     private readonly windowSceneService = WindowSceneServiceImpl.getInstance(this.windowSceneRepository);

//     private readonly cameraRepository = CameraRepositoryImpl.getInstance()
//     private readonly cameraService = CameraServiceImpl.getInstance(this.cameraRepository)


    private myDeckBackgroundScene = new MyDeckBackgroundScene();

    private initialized = false;
    private isAnimating = false;

    private userWindowSize: UserWindowSize;

    constructor(simulationMyDeckContainer: HTMLElement) {
        this.simulationMyDeckContainer = simulationMyDeckContainer;
//         this.scene = this.windowSceneService.createScene('my-deck')
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.simulationMyDeckContainer.appendChild(this.renderer.domElement);

        this.userWindowSize = UserWindowSize.getInstance()

        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -aspect * viewSize / 2, aspect * viewSize / 2,
            viewSize / 2, -viewSize / 2,
            0.1, 1000
            );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
//         const cameraObject = this.cameraService.createCamera(aspect, viewSize)
//         this.cameraId = cameraObject.getId()
//         this.camera = cameraObject.getCamera()
//         this.cameraService.setCameraPosition(this.cameraId, 0, 0, 5)
//         this.cameraService.setCameraLookAt(this.cameraId, 0, 0, 0)

        this.textureManager = TextureManager.getInstance();
        this.audioController = AudioController.getInstance();
        this.audioController.setMusic(myCardMusic);

        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.mouseController = new MouseController(this.camera, this.scene);

        window.addEventListener('click', () => this.initializeAudio(), { once: true });
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

        const myBackground = new MyDeckBackground(window.innerWidth, window.innerHeight);
        await this.myDeckBackgroundScene.addBackground(myBackground);
        this.scene.add(this.myDeckBackgroundScene.getScene());

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

    private onWindowResize(): void {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // 기존 크기와 비교해서 변경된 경우만 처리
        if (newWidth !== this.userWindowSize.getWidth() || newHeight !== this.userWindowSize.getHeight()) {
            const aspect = newWidth / newHeight;
            const viewSize = newHeight;

//             this.cameraService.updateCamera(this.cameraId, aspect, viewSize)
            this.renderer.setSize(newWidth, newHeight);


            this.userWindowSize.calculateScaleFactors(newWidth, newHeight);
            const { scaleX, scaleY } = this.userWindowSize.getScaleFactors();
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