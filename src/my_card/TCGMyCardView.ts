import * as THREE from 'three';
import { TextureManager } from "../texture_manager/TextureManager";
import { NonBackgroundImage } from "../shape/image/NonBackgroundImage";
import { AudioController } from "../audio/AudioController";
import myCardMusic from '@resource/music/my_card/my-card.mp3';
import { MouseController } from "../mouse/MouseController";
import { RouteMap } from "../router/RouteMap";
import { Component } from "../router/Component";

export class TCGMyCardView implements Component {
    private static instance: TCGMyCardView | null = null;

    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private myCardContainer: HTMLElement;
    private background: NonBackgroundImage | null = null;
    private buttons: NonBackgroundImage[] = [];
    private buttonInitialInfo: Map<string, { positionPercent: THREE.Vector2, widthPercent: number, heightPercent: number }> = new Map();
    private audioController: AudioController;
    private mouseController: MouseController;
    private routeMap: RouteMap;

    private initialized = false;
    private isAnimating = false;

    constructor(myCardContainer: HTMLElement, routeMap: RouteMap) {
        this.myCardContainer = myCardContainer;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.myCardContainer.appendChild(this.renderer.domElement);

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
        this.audioController.setMusic(myCardMusic);

        this.mouseController = new MouseController(this.camera, this.scene);
        this.routeMap = routeMap;

        window.addEventListener('click', () => this.initializeAudio(), { once: true });
    }

    public static getInstance(lobbyContainer: HTMLElement, routeMap: RouteMap): TCGMyCardView {
        if (!TCGMyCardView.instance) {
            TCGMyCardView.instance = new TCGMyCardView(lobbyContainer, routeMap);
        }
        return TCGMyCardView.instance;
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

        console.log('TCGBattleFieldView initialize() operate!!!');
        await this.textureManager.preloadTextures("image-paths.json");

        console.log("Textures preloaded. Adding background and buttons...");

        this.addBackground();

        this.initialized = true;
        this.isAnimating = true;

        this.animate();
    }

    public show(): void {
        console.log('Showing TCGMainLobbyView...');
        this.renderer.domElement.style.display = 'block';
        this.myCardContainer.style.display = 'block';
        this.isAnimating = true;
        if (!this.initialized) {
            this.initialize()
        } else {
            this.animate()
        }
    }

    public hide(): void {
        console.log('Hiding TCGMainLobbyView...');
        this.isAnimating = false;
        this.renderer.domElement.style.display = 'none';
        this.myCardContainer.style.display = 'none';
    }

    private addBackground(): void {
        const texture = this.textureManager.getTexture('my_card_background', 1);
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

    animate(): void {
        if (this.isAnimating) {
            requestAnimationFrame(() => this.animate());
            this.renderer.render(this.scene, this.camera);
        } else {
            console.log('Animation stopped.');
        }
    }
}

