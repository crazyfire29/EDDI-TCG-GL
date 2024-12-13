import * as THREE from 'three';
import { TextureManager } from "../../src/texture_manager/TextureManager";
import { NonBackgroundImage } from "../../src/shape/image/NonBackgroundImage";
import { MouseController } from "../../src/mouse/MouseController";
import { AudioController } from "../../src/audio/AudioController";
import myCardMusic from '@resource/music/my_card/my-card.mp3';
import { Component } from "../../src/router/Component";
import { TransparentRectangle } from "../../src/shape/TransparentRectangle";
import { MyDeckButtonConfigList } from "./MyDeckButtonConfigList";
import { MyDeckButtonType } from "./MyDeckButtonType";
import { DeckPageMovementButtonConfigList } from "./DeckPageMovementButtonConfigList";
import { DeckPageMovementButtonType} from "./DeckPageMovementButtonType";


export class TCGJustTestMyDeckView implements Component{
    private static instance: TCGJustTestMyDeckView | null = null;

        private scene: THREE.Scene;
        private camera: THREE.OrthographicCamera;
        private renderer: THREE.WebGLRenderer;
        private textureManager: TextureManager;
        private myDeckContainer: HTMLElement;
        private background: NonBackgroundImage | null = null;
        private notClickMyDeckButtons: NonBackgroundImage[] = [];
        private clickMyDeckButtons: NonBackgroundImage[] = [];
        private deckButtonCount: number = 6; // 사용자가 현재 만든 덱 버튼 갯수 임의로 지정
        private notClickMyDeckButtonsDict: { [id: string]: NonBackgroundImage } = {};
        private clickMyDeckButtonDict: { [id: string]: NonBackgroundImage } = {};
        private deckPageMovementButtons : NonBackgroundImage[] = [];

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
//            this.addNotClickMyDeckButton(this.deckButtonCount);
           this.addClickMyDeckButton(this.deckButtonCount);
           this.addDeckPageMovementButton();

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

       private addNotClickMyDeckButton(deckButtonCount: number): void {
           const initialX = 0.3268; // 초기 X 좌표
           const initialY = 0.2243; // Y 좌표
           const incrementY = - 0.103; // X 증가 간격(화면으로 확인 필요)
           const maxButtonsPerPage = 6; // 한 페이지 당 최대 보여지는 덱 버튼 갯수

           for (let i = 1; i <= deckButtonCount; i++){
               const deckButtonName = `testDeckButton${i}`;
               const deckButtonX = initialX;
               const deckButtonY = initialY + ((i - 1) % maxButtonsPerPage) * incrementY;

               this.notClickMyDeckButton(deckButtonName, deckButtonX, deckButtonY);

               if (i % maxButtonsPerPage === 0) {
                   console.log(`Row ${i / maxButtonsPerPage} completed. Resetting X.`);
                   }
               }
           }

       private addClickMyDeckButton(deckButtonCount: number): void {
           const initialX = 0.3268;
           const initialY = 0.22242;
           const incrementY = - 0.103;
           const maxButtonsPerPage = 6;

           for (let i = 1; i<= deckButtonCount; i++){
               const deckButtonName = `testDeckButton${i}`;
               const deckButtonX = initialX;
               const deckButtonY = initialY + ((i - 1) % maxButtonsPerPage) * incrementY;

               this.clickMyDeckButton(deckButtonName, deckButtonX, deckButtonY);
               if (i % maxButtonsPerPage === 0) {
                   console.log(`Row ${i / maxButtonsPerPage} completed. Resetting X.`);
                   }
               }
           }


       private async notClickMyDeckButton(id: string, positionXPercent: number, positionYPercent: number): Promise<void> {
           const targetConfig = MyDeckButtonConfigList.myDeckButtonConfigs.find(config => config.id === 2);
           if (!targetConfig) {
               console.error('No config with id = 2 found in MyDeckButtonConfigList.');
               return;
               }

           const notClickMyDeckButtonTexture = await this.textureManager.getTexture('my_deck_buttons', targetConfig.id);
           if (notClickMyDeckButtonTexture) {
               const widthPercent = 350 / 1920;
               const heightPercent = 90 / 1080;
               const positionPercent = new THREE.Vector2(positionXPercent, positionYPercent);

               const notClickMyDeckButton = new NonBackgroundImage(
                   window.innerWidth * widthPercent,
                   window.innerHeight * heightPercent,
                   new THREE.Vector2(
                       window.innerWidth * positionPercent.x,
                       window.innerHeight * positionPercent.y
                       )
                   );

               notClickMyDeckButton.createNonBackgroundImageWithTexture(notClickMyDeckButtonTexture, 1, 1);
               notClickMyDeckButton.draw(this.scene);
               this.notClickMyDeckButtonsDict[id] = notClickMyDeckButton;
               this.notClickMyDeckButtons.push(notClickMyDeckButton);
//                console.log("Not Click My Deck Button List: ", this.notClickMyDeckButtons);
               console.log("Not Click My Deck Button List:", this.notClickMyDeckButtonsDict);

               } else {
                   console.error("Not Click My Deck Button Texture Not Found.");
               }
           }

       private async clickMyDeckButton(id: string, positionXPercent: number, positionYPercent: number): Promise<void>{
           const targetConfig = MyDeckButtonConfigList.myDeckButtonConfigs.find(config => config.id === 1);
           if (!targetConfig){
               console.error('No config with id = 1 found in MyDeckButtonConfigList.');
               return;
               }
           const clickMyDeckButtonTexture = await this.textureManager.getTexture('my_deck_buttons', targetConfig.id);
           if(clickMyDeckButtonTexture){
               const widthPercent = 350 / 1920;
               const heightPercent = 90 / 1080;
               const positionPercent = new THREE.Vector2(positionXPercent, positionYPercent);

               const clickMyDeckButton = new NonBackgroundImage(
                   window.innerWidth * widthPercent,
                   window.innerHeight * heightPercent,
                   new THREE.Vector2(
                       window.innerWidth * positionPercent.x,
                       window.innerHeight * positionPercent.y
                       )
                   );
               clickMyDeckButton.createNonBackgroundImageWithTexture(clickMyDeckButtonTexture, 1, 1);
               clickMyDeckButton.draw(this.scene);
               this.clickMyDeckButtonDict[id] = clickMyDeckButton;
               this.notClickMyDeckButtons.push(clickMyDeckButton);
               console.log("Click My Deck Button List: ", this.clickMyDeckButtonDict);
               } else {
                   console.error("Click My Deck Button Texture Not Found.");
                   }
           }

       private async addDeckPageMovementButton(): Promise<void> {
           await Promise.all(DeckPageMovementButtonConfigList.deckPageMovementButtonConfigs.map(async (config) => {
               const deckPageMovementButtonTexture = await this.textureManager.getTexture('deck_page_movement_buttons', config.id);
               if (deckPageMovementButtonTexture) {
                   const widthPercent = 60 / 1920;
                   const heightPercent = 50 / 1080;
                   const positionPercent = new THREE.Vector2(config.position.x / 1920, config.position.y / 1080);

                   const deckPageMovementButton = new NonBackgroundImage(
                       window.innerWidth * widthPercent,
                       window.innerHeight * heightPercent,
                       new THREE.Vector2(
                           window.innerWidth * positionPercent.x,
                           window.innerHeight * positionPercent.y
                           )
                       );

                   deckPageMovementButton.createNonBackgroundImageWithTexture(deckPageMovementButtonTexture, 1, 1);
                   // 덱 버튼이 6개 이상인 경우 그려지게 함
                   if (this.deckButtonCount >= 6){
                       deckPageMovementButton.draw(this.scene);
                       this.deckPageMovementButtons.push(deckPageMovementButton);
                       }

               } else {
                   console.error("Deck Page Movement Button Texture Not Found.");
                   }

           }));
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
