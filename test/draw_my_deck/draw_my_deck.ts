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
        private notClickMyDeckButtons: NonBackgroundImage[] = []; //클릭하지 않았을 때의 덱 버튼
        private clickMyDeckButtons: NonBackgroundImage[] = []; //클릭했을 때의 덱 버튼
        private deckButtonCount: number = 10; // 사용자가 현재 만든 덱 버튼 갯수 임의로 지정
        private notClickMyDeckButtonsDict: { [id: string]: NonBackgroundImage } = {};
        private clickMyDeckButtonDict: { [id: string]: NonBackgroundImage } = {};
        private deckPageMovementButtons : NonBackgroundImage[] = []; //덱 버튼 페이지 이동 버튼
        private deckButtonPageCount: number = 1; // 페이지 count
        private deckButtonsPerPage: number = 6; // 페이지 당 덱 버튼 갯수
        private currentDeckButtonList: NonBackgroundImage[] = [];
        private currentNeonDeckButtonList: NonBackgroundImage[] = [];
        private currentClickDeckButtonId: string| null = null;; // 현재 클릭된 버튼
        private currentClickDeckButtonIdList: string[] = [];

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
           await this.addMyDeckButton(this.deckButtonCount);
           await this.addNeonMyDeckButton(this.deckButtonCount);
           await this.addDeckPageMovementButton();
           this.renderCurrentDeckButtonPage();

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

       private hideDeckButton(id: string): void {
           const button = this.notClickMyDeckButtonsDict[id];
           if (!button) {
               console.warn(`No button found with ID: ${id}`);
               return;
               }

           // 씬에서 버튼 제거
           this.scene.remove(button.getMesh());

           // MouseController 버튼 등록 해제
//            this.mouseController.unregisterButton(button.getMesh());

           }

       private showDeckButton(id: string): void {
           const button = this.notClickMyDeckButtonsDict[id];
           if (!button) {
               console.warn(`No button found with ID: ${id}`);
               return;
               }
           button.draw(this.scene);

           }

       private showNeonDeckButton(id: string): void {
           const button = this.clickMyDeckButtonDict[id];
           if (!button) {
               console.warn(`No Button found with ID: ${id}`);
               return;
               }

           button.draw(this.scene);
           this.mouseController.registerButton(button.getMesh(),this.onNeonDeckButtonClick.bind(this, id));

           }

       private hideNeonDeckButton(id: string): void{
           const button = this.clickMyDeckButtonDict[id];
           if (!button) {
               console.warn(`No Button found with ID: ${id}`);
               return;
               }
           this.scene.remove(button.getMesh());
           this.mouseController.unregisterButton(button.getMesh());
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

       private addMyDeckButton(deckButtonCount: number): void {
           const initialX = 0.3268; // 초기 X 좌표
           const initialY = 0.2243; // Y 좌표
           const incrementY = - 0.103; // X 증가 간격(화면으로 확인 필요)
           const maxButtonsPerPage = 6; // 한 페이지 당 최대 보여지는 덱 버튼 갯수

           for (let i = 1; i <= deckButtonCount; i++){
               const deckButtonName = `testDeckButton${i}`;
               const deckButtonX = initialX;
               const deckButtonY = initialY + ((i - 1) % maxButtonsPerPage) * incrementY;

               this.MyDeckButton(deckButtonName, deckButtonX, deckButtonY);

               if (i % maxButtonsPerPage === 0) {
                   console.log(`Row ${i / maxButtonsPerPage} completed. Resetting X.`);
                   }
               }
           }

       private addNeonMyDeckButton(deckButtonCount: number): void {
           const initialX = 0.3268;
           const initialY = 0.22242;
           const incrementY = - 0.103;
           const maxButtonsPerPage = 6;

           for (let i = 1; i<= deckButtonCount; i++){
               const deckButtonName = `testDeckButton${i}`;
               const deckButtonX = initialX;
               const deckButtonY = initialY + ((i - 1) % maxButtonsPerPage) * incrementY;

               this.NeonMyDeckButton(deckButtonName, deckButtonX, deckButtonY);
               if (i % maxButtonsPerPage === 0) {
                   console.log(`Row ${i / maxButtonsPerPage} completed. Resetting X.`);
                   }
               }
           }


       private async MyDeckButton(id: string, positionXPercent: number, positionYPercent: number): Promise<void> {
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
//                notClickMyDeckButton.draw(this.scene);
               this.notClickMyDeckButtonsDict[id] = notClickMyDeckButton;
               this.notClickMyDeckButtons.push(notClickMyDeckButton);

//                console.log("Not Click My Deck Button List: ", this.notClickMyDeckButtons);
               console.log("Not Click My Deck Button List:", this.notClickMyDeckButtonsDict);

               } else {
                   console.error("Not Click My Deck Button Texture Not Found.");
               }
           }

       private async NeonMyDeckButton(id: string, positionXPercent: number, positionYPercent: number): Promise<void>{
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
               this.clickMyDeckButtonDict[id] = clickMyDeckButton;
               this.clickMyDeckButtons.push(clickMyDeckButton);
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
                   // 덱 버튼이 7개 이상인 경우 그려지게 함
                   if (this.deckButtonCount >= 7){
                       deckPageMovementButton.draw(this.scene);
                       this.deckPageMovementButtons.push(deckPageMovementButton);
                       this.mouseController.registerButton(deckPageMovementButton.getMesh(), this.onDeckPageMovementButtonClick.bind(this, config.type));
                       }

               } else {
                   console.error("Deck Page Movement Button Texture Not Found.");
                   }

           }));
       }

       private onDeckPageMovementButtonClick(type: DeckPageMovementButtonType): void {
           console.log("DeckPageMovement Button Click !");

           if (this.currentClickDeckButtonId !== null) {
               this.hideNeonDeckButton(this.currentClickDeckButtonId);
//                this.showDeckButton(this.currentClickDeckButtonId);
               this.currentClickDeckButtonId = null; // 클릭된 버튼 ID를 초기화
               this.currentClickDeckButtonIdList = [];
               }

           switch(type) {
               case DeckPageMovementButtonType.PREV:
                   console.log("Prev Button Click!");
                   if(this.deckButtonPageCount > 1){
                       this.deckButtonPageCount--;
                       console.log(`Current Page: ${this.deckButtonPageCount}`);
                       this.renderCurrentDeckButtonPage();
                       console.log("Current Deck Button List: ", this.currentDeckButtonList);
                       } else{
                           console.log('First Page');
                           this.renderCurrentDeckButtonPage();
                           console.log("Current Deck Button List: ", this.currentDeckButtonList);
                           }
                   break;

               case DeckPageMovementButtonType.NEXT:
                   console.log("Next Button Click!")
                   if (this.deckButtonPageCount < Math.ceil(this.notClickMyDeckButtons.length / this.deckButtonsPerPage)) {
                       this.deckButtonPageCount++;
                       console.log(`Current Page: ${this.deckButtonPageCount}`);
                       this.renderCurrentDeckButtonPage();
                       console.log("Current Deck Button List: ", this.currentDeckButtonList);
                       } else {
                           console.log("Last Page");
                           this.renderCurrentDeckButtonPage();
                           console.log("Current Deck Button List: ", this.currentDeckButtonList);
                           }
                   break;
               default:
                   console.error("Unknown Page Movement Button Type:", type);
               }
           }

       private renderCurrentDeckButtonPage(): void {
           console.log("Not Click Deck Buttons List: ", this.notClickMyDeckButtons);
           // 현재 씬에 그려져 있는 덱 버튼 제거
           this.currentDeckButtonList.forEach(deckButton => {
               this.mouseController.unregisterButton(deckButton.getMesh());
               this.scene.remove(deckButton.getMesh());
               });

           this.currentDeckButtonList = [];

           // 현재 페이지의 카드 인덱스 범위 계산
           const startIndex = (this.deckButtonPageCount - 1) * this.deckButtonsPerPage;
           const endIndex = Math.min(startIndex + this.deckButtonsPerPage, this.notClickMyDeckButtons.length);

           // 현재 페이지에 해당하는 덱 버튼만 씬에 추가
           for (let i = startIndex; i < endIndex; i++) {
               const keys = Object.keys(this.notClickMyDeckButtonsDict);
               const deckButtons = Object.values(this.notClickMyDeckButtonsDict);
               const deckButton = deckButtons[i];
//                const deckButton = this.notClickMyDeckButtons[i];
               if (!deckButton) {
                   console.warn(`Deck button at index ${i} is undefined.`);
                   continue;
                   }

               const key = keys[i];
               deckButton.draw(this.scene);
               this.currentDeckButtonList.push(deckButton);
               this.mouseController.registerButton(deckButton.getMesh(),this.onDeckButtonClick.bind(this, key));
           }
           console.log(`Current Deck Buttons: ${this.currentDeckButtonList.length}`);
           console.log("Current Deck Button?: ", this.currentDeckButtonList);
           console.log(`Rendering Page ${this.deckButtonPageCount}: Showing cards ${startIndex + 1} to ${endIndex}`);

           }


       // 만들어진 덱 버튼 클릭 이벤트(네온 효과 버튼으로 교체)
       private onDeckButtonClick(id: string): void {

           if (this.currentClickDeckButtonId !== null) {
                   this.hideNeonDeckButton(this.currentClickDeckButtonId);
                   this.showDeckButton(this.currentClickDeckButtonId);
               }

           // 현재 클릭된 버튼을 네온 버튼으로 전환
           this.currentClickDeckButtonId = id;
           this.hideDeckButton(id);
           this.showNeonDeckButton(id);
           console.log(`Current Click Button: ${this.currentClickDeckButtonId}`)
//            this.currentClickDeckButtonId = id;
//            this.currentClickDeckButtonIdList.push(id)
//            console.log(`Current Click Button: ${this.currentClickDeckButtonId}`);
//            console.log(`Current Click Button List: ${this.currentClickDeckButtonIdList}`);
//
//            if (this.currentClickDeckButtonId !== null) {
//                this.hideDeckButton(this.currentClickDeckButtonId);
//                this.showNeonDeckButton(this.currentClickDeckButtonId);
//                if (this.currentClickDeckButtonIdList.length > 1) {
//                    this.hideNeonDeckButton(this.currentClickDeckButtonIdList[0]);
//                    this.showDeckButton(this.currentClickDeckButtonIdList[0]);
//                    this.currentClickDeckButtonIdList.shift() // 첫 번째로 클릭한 요소 삭제
//                    }
//                }
//
//            console.log("Updated Not Click My Deck Button List:", this.notClickMyDeckButtonsDict);

       }

       // 네온 버튼 클릭(다시 누르면 다시 안 눌렀을 때의 버튼이 나타남.)
       private onNeonDeckButtonClick(id: string): void {
           console.log(`Neon Deck Button Clicked: ${id}`);
           this.hideNeonDeckButton(id);
           this.showDeckButton(id);
           this.currentClickDeckButtonId == null;
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
