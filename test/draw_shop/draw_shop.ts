import * as THREE from 'three';
import { TextureManager } from "../../src/texture_manager/TextureManager";
import { NonBackgroundImage } from "../../src/shape/image/NonBackgroundImage";
import { AudioController } from "../../src/audio/AudioController";
import cardShopMusic from '@resource/music/shop/card-shop.mp3';
import { MouseController } from "../../src/mouse/MouseController";
import {RouteMap} from "../../src/router/RouteMap";
import {routes} from "../../src/router/routes";
import { Component } from "../../src/router/Component";
import { TransparentRectangle } from "../../src/shape/TransparentRectangle";

export class TCGJustTestShopView implements Component{
    private static instance: TCGJustTestShopView | null = null;

        private scene: THREE.Scene;
        private camera: THREE.OrthographicCamera;
        private renderer: THREE.WebGLRenderer;
        private textureManager: TextureManager;
        private shopContainer: HTMLElement;
        private background: NonBackgroundImage | null = null;
        private buttons: NonBackgroundImage[] = [];
        private buttonInitialInfo: Map<string, { positionPercent: THREE.Vector2, widthPercent: number, heightPercent: number }> = new Map();
        private audioController: AudioController;

        private initialized = false;
        private isAnimating = false;

        private transparentRectangles: TransparentRectangle[] = []
        private rectInitialInfo: Map<string, { positionPercent: THREE.Vector2, widthPercent: number, heightPercent: number }> = new Map();


        constructor(shopContainer: HTMLElement) {
                this.shopContainer = shopContainer; //캔버스
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

            }


        public static getInstance(shopContainer: HTMLElement): TCGJustTestShopView {
                if (!TCGJustTestShopView.instance) {
                    TCGJustTestShopView.instance = new TCGJustTestShopView(shopContainer);
                }
                return TCGJustTestShopView.instance;
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

               console.log('TCGJustTestShopView initialize() operate!!!');
               await this.textureManager.preloadTextures("image-paths.json");

               console.log("Textures preloaded. Adding background and buttons...");

               this.addBackground();
               this.initialized = true;
               this.isAnimating = true;
               this.animate();
           }

       public show(): void {
               console.log('Showing TCGJustTestShopView...');
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
               console.log('Hiding TCGJustTestShopView...');
               this.isAnimating = false;
               this.renderer.domElement.style.display = 'none';
               this.shopContainer.style.display = 'none';

           }


       private async addBackground(): Promise<void> {
               const texture = await this.textureManager.getTexture('shop_background', 1);
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

       public animate(): void {
               if (this.isAnimating) {
                   requestAnimationFrame(() => this.animate());
                   this.renderer.render(this.scene, this.camera);
               } else {
                   console.log('TCGCardShop: Animation stopped.');
               }
           }

    }

const rootElement = document.getElementById('app');


if (!rootElement) {
    throw new Error("Cannot find element with id 'app'.");
}

const fieldView = TCGJustTestShopView.getInstance(rootElement);
fieldView.initialize();