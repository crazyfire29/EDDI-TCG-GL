import * as THREE from 'three';
import { TextureManager } from "../../src/texture_manager/TextureManager";
import { NonBackgroundImage } from "../../src/shape/image/NonBackgroundImage";
import { AudioController } from "../../src/audio/AudioController";
import cardShopMusic from '@resource/music/shop/card-shop.mp3';
import { MouseController } from "../../src/mouse/MouseController";
import { Component } from "../../src/router/Component";
import { TransparentRectangle } from "../../src/shape/TransparentRectangle";
import { RouteMap } from "../../src/router/RouteMap";
import { routes } from "../../src/router/routes";
import { TCGMainLobbyView } from "../../src/lobby/TCGMainLobbyView";


export class TCGJustTestSelectCardScreenView implements Component{
    private static instance: TCGJustTestSelectCardScreenView | null = null;

        private scene: THREE.Scene;
        private camera: THREE.OrthographicCamera;
        private renderer: THREE.WebGLRenderer;
        private textureManager: TextureManager;
        private shopContainer: HTMLElement;
        private background: NonBackgroundImage | null = null;
        private transparentRectangles: TransparentRectangle[] = [];
        private transparentBackground: TransparentRectangle | null = null;
        private tryAgainScreen: NonBackgroundImage | null = null;

        private audioController: AudioController;
        private mouseController: MouseController;


        private initialized = false;
        private isAnimating = false;


        constructor(shopContainer: HTMLElement) {
                this.shopContainer = shopContainer;
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0xffffff);
                this.renderer = new THREE.WebGLRenderer();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.shopContainer.appendChild(this.renderer.domElement);

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
                this.audioController.setMusic(cardShopMusic);

//                 window.addEventListener('resize', this.onWindowResize.bind(this));

                this.mouseController = new MouseController(this.camera, this.scene);
                window.addEventListener('click', () => this.initializeAudio(), { once: true });

            }


        public static getInstance(shopContainer: HTMLElement): TCGJustTestSelectCardScreenView {
                if (!TCGJustTestSelectCardScreenView.instance) {
                    TCGJustTestSelectCardScreenView.instance = new TCGJustTestSelectCardScreenView(shopContainer);
                }
                return TCGJustTestSelectCardScreenView.instance;
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

               console.log('TCGJustTestSelectCardScreenView initialize() operate!!!');
               await this.textureManager.preloadTextures("image-paths.json");

               console.log("Textures preloaded. Adding background and buttons...");

               await this.addBackground();
               this.addTransparentRectangles();

               this.initialized = true;
               this.isAnimating = true;

               this.animate();
           }

       public show(): void {
               console.log('Showing TCGJustTestSelectCardScreenView...');
               this.renderer.domElement.style.display = 'block';
               this.shopContainer.style.display = 'block';
               this.isAnimating = true;

               this.scene.children.forEach(child => {
                   child.visible = true;
               });

               if (!this.initialized) {
                   this.initialize();
               } else {
                   this.animate();
               }
           }

       public hide(): void {
               console.log('Hiding TCGJustTestSelectCardScreenView...');
               this.isAnimating = false;
               this.renderer.domElement.style.display = 'none';
               this.shopContainer.style.display = 'none';

               this.transparentRectangles.forEach(rectangle => {
                   this.mouseController.unregisterButton(rectangle.getMesh());
                   this.scene.remove(rectangle.getMesh());
                   });

               this.mouseController.clearButtons();
               this.transparentRectangles = [];
           }

       private async addBackground(): Promise<void> {
           const texture = await this.textureManager.getTexture('select_card_screen', 1);
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

       private async addTryAgainScreen(): Promise<void> {
           const texture = await this.textureManager.getTexture('try_again_screen', 1);
           console.log('addTryAgainScreen():', texture);
           if (texture) {
               if (!this.tryAgainScreen) {
                   const widthPercent = 900 / 1920;
                   const heightPercent = 500 / 1080;
                   const positionPercent = new THREE.Vector2(0, 0);

                    this.tryAgainScreen = new NonBackgroundImage(
                        window.innerWidth * widthPercent,
                        window.innerHeight * heightPercent,
                        new THREE.Vector2(
                            window.innerWidth * positionPercent.x,
                            window.innerHeight * positionPercent.y)
                        );
               }
               this.tryAgainScreen.createNonBackgroundImageWithTexture(texture, 1, 1);
               this.tryAgainScreen.draw(this.scene);
               } else {
                   console.error("Background texture not found.");
                   }
           }

       private addTransparentBackground(id:string): void {
           const screenWidth = window.innerWidth;
           const screenHeight = window.innerHeight;

           const position = new THREE.Vector2(0,0);

           const width = screenWidth;
           const height = screenHeight;

           this.transparentBackground = new TransparentRectangle(position, width, height, 0x000000, 0.7, id);
           this.transparentBackground.addToScene(this.scene);

           }

       private removeTransparentBackground(): void {
           if (this.transparentBackground) {
               this.transparentBackground.removeFromScene(this.scene);
               this.transparentBackground = null;
               }
           }


       private addTransparentRectangles(): void {
           // 다시 뽑기 버튼
           const returnSelectButtonX = 0.93394;
           const returnSelectButtonY = 0.14834;
           this.addTransparentRectangle('returnSelectButton', returnSelectButtonX, returnSelectButtonY);

           // 로비 버튼
           const lobbyButtonX = 0.93794;
           const lobbyButtonY = 0.23234;
           this.addTransparentRectangle('lobbyButton', lobbyButtonX, lobbyButtonY);

           console.log('Add Transparent Button !');

           }


       private addTransparentRectangle(id: string, positionXPercent: number, positionYPercent: number): void {
           const screenWidth = window.innerWidth;
           const screenHeight = window.innerHeight;

           const positionX = (positionXPercent - 0.5) * screenWidth
           const positionY = (0.5 - positionYPercent) * screenHeight

           console.log('TransparentRectangle Position:', positionX, positionY);

           const position = new THREE.Vector2(
               positionX, positionY
           );

           const width = 0.07415 * screenWidth
           const height = 0.05658 * screenHeight
           console.log('Calculated position:', position, 'Width:', width, 'Height:', height);

           const transparentRectangle = new TransparentRectangle(position, width, height, 0xffffff, 0.5, id);
           transparentRectangle.addToScene(this.scene);
           this.mouseController.registerButton(transparentRectangle.getMesh(), this.onTransparentRectangleClick.bind(this, id));
           this.transparentRectangles.push(transparentRectangle);

           }

       private onTransparentRectangleClick(id: string): void {
           console.log("TransparentRectangle Button Click !");
           switch(id) {
               case 'lobbyButton':
                   console.log("Select Result Lobby Button Click!");
                   this.hide();
                   const rootElement = document.getElementById('lobby');
                   if (rootElement) {
                       const routeMap = new RouteMap(rootElement, '/tcg-main-lobby');
                       routeMap.registerRoutes(routes);

                       rootElement.style.display = 'block';
                       const lobbyView = TCGMainLobbyView.getInstance(rootElement, routeMap);
                       lobbyView.initialize();

                   } else {
                       console.error('Root element not found');
                   }
                   break;
                   case 'returnSelectButton':
                       console.log("Wait! not yet prepare..")
                       this.addTransparentBackground('transparentBackground');
                       this.addTryAgainScreen();
                       break;
                   default:
                       console.error("Unknown TransparentRectangle ID:", id);
                   }
               }


       public animate(): void {
           if (this.isAnimating) {
               requestAnimationFrame(() => this.animate());
               this.renderer.render(this.scene, this.camera);
           } else {
               console.log('TCGJustTestSelectCardScreenView: Animation stopped.');
           }
       }
   }


const rootElement = document.getElementById('select_result');

if (!rootElement) {
    throw new Error("Cannot find element with id 'app'.");
}

const resultView = TCGJustTestSelectCardScreenView.getInstance(rootElement);
resultView.initialize();

