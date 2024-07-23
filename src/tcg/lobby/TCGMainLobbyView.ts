import * as THREE from 'three';
import {TextureManager} from "../../texture_manager/TextureManager";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";

export class TCGMainLobbyView {
    private scene: THREE.Scene;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private lobbyContainer: HTMLElement;
    private background: NonBackgroundImage | null = null;
    private buttons: NonBackgroundImage[] = [];

    constructor(lobbyContainer: HTMLElement) {
        this.lobbyContainer = lobbyContainer;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.lobbyContainer.appendChild(this.renderer.domElement);

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

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    public async initialize(): Promise<void> {
        await this.textureManager.preloadTextures("image-paths.json");

        console.log("Textures preloaded. Adding background and buttons...");

        this.addBackground();
        this.addButtons();
        this.animate();
    }

    private addBackground(): void {
        const texture = this.textureManager.getTexture('main_lobby_background', 1);
        console.log('addBackground():', texture);
        if (texture) {
            const background = new NonBackgroundImage(
                window.innerWidth,
                window.innerHeight,
                'resource/main_lobby/background.png',
                1, 1,
                new THREE.Vector2(0, 0)
            );
            background.setTexture(texture);
            background.draw(this.scene);
        } else {
            console.error("Background texture not found.");
        }
    }

    private addButtons(): void {
        const buttonTexture = this.textureManager.getTexture('main_lobby_buttons', 1);
        if (buttonTexture) {
            const button = new NonBackgroundImage(
                200,
                100,
                'resource/main_lobby/buttons/button1.png',
                1, 1,
                new THREE.Vector2(0, -200)
            );
            button.setTexture(buttonTexture);
            button.draw(this.scene);

            this.lobbyContainer.addEventListener('click', (event) => this.onButtonClick(event, button));
        } else {
            console.error("Button texture not found.");
        }
    }

    private onButtonClick(event: MouseEvent, button: NonBackgroundImage): void {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(button.getMesh());

        if (intersects.length > 0) {
            console.log('Button clicked');
            window.location.href = "/new-path";
        }
    }

    private onWindowResize(): void {
        const aspect = window.innerWidth / window.innerHeight;
        const viewSize = window.innerHeight;
        this.camera.left = -aspect * viewSize / 2;
        this.camera.right = aspect * viewSize / 2;
        this.camera.top = viewSize / 2;
        this.camera.bottom = -viewSize / 2;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        if (this.background) {
            this.background.setScale(window.innerWidth, window.innerHeight);
        }
    }

    public animate(): void {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
