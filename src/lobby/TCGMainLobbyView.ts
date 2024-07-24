import * as THREE from 'three';
import {TextureManager} from "../texture_manager/TextureManager";
// import {LegacyNonBackgroundImage} from "../shape/image/LegacyNonBackgroundImage";
import {NonBackgroundImage} from "../shape/image/NonBackgroundImage";
import {LobbyButtonConfigList} from "./LobbyButtonConfigList";
import {LobbyButtonType} from "./LobbyButtonType";
import {AudioController} from "../audio/AudioController";

import lobbyMusic from '@resource/music/lobby/lobby-menu.mp3'
import {MouseController} from "../mouse/MouseController";
import {RouteMap} from "../router/RouteMap";
import {Component} from "../router/Component";

export class TCGMainLobbyView implements Component {
    private static instance: TCGMainLobbyView | null = null;

    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private lobbyContainer: HTMLElement;
    private background: NonBackgroundImage | null = null;
    private buttons: NonBackgroundImage[] = [];
    private audioController: AudioController;
    private mouseController: MouseController;
    private routeMap: RouteMap;

    private initialized = false

    constructor(lobbyContainer: HTMLElement, routeMap: RouteMap) {
        this.lobbyContainer = lobbyContainer;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.renderer = new THREE.WebGLRenderer();
        // this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha: true로 설정
        // this.renderer.setClearColor(0xffffff, 0); // 배경을 흰색으로 설정하지만 투명하게 만듭니다.

        // canvas 스타일 설정
        // this.renderer.domElement.style.backgroundColor = 'rgba(255, 255, 255, 0)';
        // this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        console.log('this.renderer:', this.renderer)

        console.log('Lobby Container Width:', lobbyContainer.clientWidth);
        console.log('Lobby Container Height:', lobbyContainer.clientHeight);

        // this.renderer.setSize(lobbyContainer.clientWidth, lobbyContainer.clientHeight);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.lobbyContainer.appendChild(this.renderer.domElement);

        console.log('Window Inner Width / Height:', window.innerWidth, window.innerHeight);

        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = window.innerHeight;
        this.camera = new THREE.OrthographicCamera(
            -aspect * viewSize / 2, aspect * viewSize / 2,
            viewSize / 2, -viewSize / 2,
            0.1, 1000
        );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);

        this.textureManager = TextureManager.getInstance();
        this.audioController = AudioController.getInstance();
        this.audioController.setMusic(require('@resource/music/lobby/lobby-menu.mp3'));

        window.addEventListener('resize', this.onWindowResize.bind(this));

        // this.initializeAudio();
        this.mouseController = MouseController.getInstance(this.camera, this.scene);
        this.routeMap = routeMap;

        window.addEventListener('click', () => this.initializeAudio(), { once: true });
    }

    public static getInstance(lobbyContainer: HTMLElement, routeMap: RouteMap): TCGMainLobbyView {
        if (!TCGMainLobbyView.instance) {
            TCGMainLobbyView.instance = new TCGMainLobbyView(lobbyContainer, routeMap);
        }
        return TCGMainLobbyView.instance;
    }

    private async initializeAudio(): Promise<void> {
        try {
            await this.audioController.playMusic();
        } catch (error) {
            console.error('Initial audio play failed:', error);
        }
    }

    public async initialize(): Promise<void> {
        // if (this.initialized) return;
        // this.initialized = true;

        console.log('TCGMainLobbyView initialize() operate!!!')
        await this.textureManager.preloadTextures("image-paths.json");

        console.log("Textures preloaded. Adding background and buttons...");

        this.addBackground();
        this.addButtons();
        // this.setupAudio();
        this.animate();

        // requestAnimationFrame(() => {
        //     this.addBackground();
        //     this.addButtons();
        //     this.animate();
        // });
    }

    public dispose(): void {
        console.log('Disposing TCGMainLobbyView...');
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        window.removeEventListener('click', () => this.initializeAudio());

        this.renderer.dispose();
        if (this.renderer.domElement.parentNode === this.lobbyContainer) {
            this.lobbyContainer.removeChild(this.renderer.domElement);
        }

        this.scene.clear();

        TCGMainLobbyView.instance = null;
    }

    private setupAudio(): void {
        this.audioController.setMusic(require('@resource/music/lobby/lobby-menu.mp3'));
        this.audioController.playMusic();
        // this.audioController.addSoundEffect('buttonClick', 'path/to/your/buttonClick/sound.mp3');
    }

    private addBackground(): void {
        const texture = this.textureManager.getTexture('main_lobby_background', 1);
        console.log('addBackground():', texture);
        if (texture) {
            if (!this.background) {
                this.background = new NonBackgroundImage(
                    window.innerWidth,
                    window.innerHeight,
                    new THREE.Vector2(0, 0)
                );
            }
            this.background.createNonBackgroundImageWithTexture(texture, 1, 1);
            this.background.draw(this.scene);
        } else {
            console.error("Background texture not found.");
        }
    }

    private addButtons(): void {
        LobbyButtonConfigList.buttonConfigs.forEach((config) => {
            const buttonTexture = this.textureManager.getTexture('main_lobby_buttons', config.id);
            if (buttonTexture) {
                let button = this.buttons.find(btn => btn.getLocalTranslation().equals(config.position));
                if (!button) {
                    button = new NonBackgroundImage(
                        800,
                        100,
                        config.position
                    );
                    this.buttons.push(button);

                    button.createNonBackgroundImageWithTexture(buttonTexture, 1, 1);
                }

                button.draw(this.scene);
                this.mouseController.registerButton(button.getMesh(), this.onButtonClick.bind(this, config.type));
            } else {
                console.error("Button texture not found.");
            }
        });
    }

    // private addBackground(): void {
    //     const texture = this.textureManager.getTexture('main_lobby_background', 1);
    //     console.log('addBackground():', texture);
    //     if (texture) {
    //         const background = new LegacyNonBackgroundImage(
    //             // this.lobbyContainer.clientWidth,
    //             // this.lobbyContainer.clientHeight,
    //             window.innerWidth,
    //             window.innerHeight,
    //             'resource/main_lobby/background.png',
    //             1, 1,
    //             new THREE.Vector2(0, 0),
    //         );
    //
    //         console.log('background:', background)
    //         background.setTexture(texture);
    //         background.draw(this.scene);
    //         this.background = background
    //     } else {
    //         console.error("Background texture not found.");
    //     }
    // }
    //
    // private addButtons(): void {
    //     LobbyButtonConfigList.buttonConfigs.forEach((config) => {
    //         const buttonTexture = this.textureManager.getTexture('main_lobby_buttons', config.id);
    //         if (buttonTexture) {
    //             const button = new LegacyNonBackgroundImage(
    //                 800,
    //                 100,
    //                 config.imagePath,
    //                 1, 1,
    //                 config.position,
    //             );
    //             button.setTexture(buttonTexture);
    //             button.draw(this.scene);
    //
    //             this.buttons.push(button);
    //             // this.lobbyContainer.addEventListener('click', (event) => this.onButtonClick(event, button, config.type));
    //             // this.mouseController.registerButton(button.getMesh(), () => this.onButtonClick(config.type));
    //             this.mouseController.registerButton(button.getMesh(), this.onButtonClick.bind(this, config.type));
    //         } else {
    //             console.error("Button texture not found.");
    //         }
    //     });
    // }

    // private onButtonClick(event: MouseEvent, button: LegacyNonBackgroundImage, type: LobbyButtonType): void {
    //     const mouse = new THREE.Vector2(
    //         (event.clientX / window.innerWidth) * 2 - 1,
    //         -(event.clientY / window.innerHeight) * 2 + 1
    //     );
    //
    //     const raycaster = new THREE.Raycaster();
    //     raycaster.setFromCamera(mouse, this.camera);
    //     const intersects = raycaster.intersectObject(button.getMesh());
    //
    //     if (intersects.length > 0) {
    //         console.log('Button clicked');
    //         window.location.href = "/new-path";
    //     }
    // }

    private onButtonClick(type: LobbyButtonType): void {
        console.log('Button clicked:', type);
        switch (type) {
            case LobbyButtonType.OneVsOne:
                this.routeMap.navigate("/one-vs-one");
                break;
            case LobbyButtonType.MyCards:
                this.routeMap.navigate("/my-cards");
                break;
            case LobbyButtonType.Shop:
                this.routeMap.navigate("/shop");
                break;
            case LobbyButtonType.Test:
                this.routeMap.navigate("/test");
                break;
            default:
                console.error("Unknown button type:", type);
        }
    }

    private onWindowResize(): void {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const aspect = newWidth / newHeight;
        const viewSize = newHeight;

        this.camera.left = -aspect * viewSize / 2;
        this.camera.right = aspect * viewSize / 2;
        this.camera.top = viewSize / 2;
        this.camera.bottom = -viewSize / 2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.background) {
            const scaleX = newWidth / this.background.getWidth();
            const scaleY = newHeight / this.background.getHeight();
            this.background.setScale(scaleX, scaleY);
        }
    }

    public animate(): void {
        // console.log('TCGMainLobbyView -> scene:', this.scene)
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
