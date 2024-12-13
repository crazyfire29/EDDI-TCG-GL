import * as THREE from 'three';
import { TextureManager } from "../../src/texture_manager/TextureManager";
import { NonBackgroundImage } from "../../src/shape/image/NonBackgroundImage";
import { MouseController } from "../../src/mouse/MouseController";
import { AudioController } from "../../src/audio/AudioController";
import myCardMusic from '@resource/music/my_card/my-card.mp3';
import { Component } from "../../src/router/Component";
import { TransparentRectangle } from "../../src/shape/TransparentRectangle";


export class TCGJustTestMyDeckView implements Component{
    private static instance: TCGJustTestMyDeckView | null = null;

        private scene: THREE.Scene;
        private camera: THREE.OrthographicCamera;
        private renderer: THREE.WebGLRenderer;
        private textureManager: TextureManager;
        private myDeckContainer: HTMLElement;
        private background: NonBackgroundImage | null = null;

        private audioController: AudioController;
        private mouseController: MouseController;


        private initialized = false;
        private isAnimating = false;


        constructor(myDeckContainer: HTMLElement) {
            this.myDeckContainer = myDeckContainer;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0xffffff);
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.myDeckContainer.appendChild(this.renderer.domElement);

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

//             window.addEventListener('resize', this.onWindowResize.bind(this));

            this.mouseController = new MouseController(this.camera, this.scene);
            window.addEventListener('click', () => this.initializeAudio(), { once: true });

        }


        public static getInstance(myDeckContainer: HTMLElement): TCGJustTestMyDeckView {
            if (!TCGJustTestMyDeckView.instance) {
                TCGJustTestMyDeckView.instance = new TCGJustTestMyDeckView(myDeckContainer);
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

           this.initialized = true;
           this.isAnimating = true;

           this.animate();
       }

       public show(): void {
           console.log('Showing TCGJustTestMyDeckView...');
           this.renderer.domElement.style.display = 'block';
           this.myDeckContainer.style.display = 'block';
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
           console.log('Hiding TCGJustTestMyDeckView...');
           this.isAnimating = false;
           this.renderer.domElement.style.display = 'none';
           this.myDeckContainer.style.display = 'none';

           this.mouseController.clearButtons();

       }

       private async addBackground(): Promise<void> {
           const texture = await this.textureManager.getTexture('my_deck_background', 1);
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

const rootElement = document.getElementById('my_deck');

if (!rootElement) {
    throw new Error("Cannot find element with id 'app'.");
}

const myDeckView = TCGJustTestMyDeckView.getInstance(rootElement);
myDeckView.initialize();
