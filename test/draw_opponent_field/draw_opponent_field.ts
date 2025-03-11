import * as THREE from 'three';
import battleFieldMusic from '@resource/music/battle_field/battle-field.mp3';
import {TextureManager} from "../../src/texture_manager/TextureManager";
import {NonBackgroundImage} from "../../src/shape/image/NonBackgroundImage";
import {AudioController} from "../../src/audio/AudioController";
import {MouseController} from "../../src/mouse/MouseController";
import {BattleFieldHandSceneRepository} from "../../src/battle_field_hand/deprecated_repository/BattleFieldHandSceneRepository";

import {UserWindowSize} from "../../src/window_size/WindowSize"
import {UnitCardGenerator} from "../../src/card/unit/generate";
import {SupportCardGenerator} from "../../src/card/support/generate";
import {ItemCardGenerator} from "../../src/card/item/generate";
import {EnergyCardGenerator} from "../../src/card/energy/generate";
import {BattleFieldHandMapRepositoryImpl} from "../../src/battle_field_hand/repository/BattleFieldHandMapRepositoryImpl";

import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {MaskPass} from "three/examples/jsm/postprocessing/MaskPass";
import {BackgroundServiceImpl} from "../../src/background/service/BackgroundServiceImpl";
import {BattleFieldHandServiceImpl} from "../../src/battle_field_hand/service/BattleFieldHandServiceImpl";
import {LeftClickDetectService} from "../../src/left_click_detect/service/LeftClickDetectService";
import {DragMoveService} from "../../src/drag_move/service/DragMoveService";
import {MouseDropService} from "../../src/mouse_drop/service/MouseDropService";
import {YourFieldAreaServiceImpl} from "../../src/your_field_area/service/YourFieldAreaServiceImpl";
import {WindowSceneRepositoryImpl} from "../../src/window_scene/repository/WindowSceneRepositoryImpl";
import {WindowSceneServiceImpl} from "../../src/window_scene/service/WindowSceneServiceImpl";
import {CameraRepositoryImpl} from "../../src/camera/repository/CameraRepositoryImpl";
import {CameraServiceImpl} from "../../src/camera/service/CameraServiceImpl";
import {LeftClickDetectServiceImpl} from "../../src/left_click_detect/service/LeftClickDetectServiceImpl";
import {DragMoveServiceImpl} from "../../src/drag_move/service/DragMoveServiceImpl";
import {MouseDropServiceImpl} from "../../src/mouse_drop/service/MouseDropServiceImpl";
import {NeonShape} from "../../src/neon/NeonShape";
import {OpponentFieldAreaServiceImpl} from "../../src/opponent_field_area/service/OpponentFieldAreaServiceImpl";
import {KeyboardService} from "../../src/keyboard/service/KeyboardService";
import {KeyboardServiceImpl} from "../../src/keyboard/service/KeyboardServiceImpl";
import {OpponentFieldMapRepositoryImpl} from "../../src/opponent_field_map/repository/OpponentFieldMapRepositoryImpl";
import {OpponentFieldServiceImpl} from "../../src/opponent_field/service/OpponentFieldServiceImpl";
import {RightClickDetectServiceImpl} from "../../src/right_click_detect/service/RightClickDetectServiceImpl";
import {RightClickDetectService} from "../../src/right_click_detect/service/RightClickDetectService";
import {LeftClickedArea} from "../../src/left_click_detect/entity/LeftClickedArea";


export class TCGJustTestBattleFieldView {
    private static instance: TCGJustTestBattleFieldView | null = null;

    private scene: THREE.Scene;
    private cameraId: number;
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;
    private textureManager: TextureManager;
    private simulationBattleFieldContainer: HTMLElement;

    private buttons: NonBackgroundImage[] = [];
    private buttonInitialInfo: Map<string, { positionPercent: THREE.Vector2, widthPercent: number, heightPercent: number }> = new Map();
    private audioController: AudioController;
    private mouseController: MouseController;

    private background: NonBackgroundImage | null = null;
    private backgroundService = BackgroundServiceImpl.getInstance()

    private battleFieldHandService = BattleFieldHandServiceImpl.getInstance()
    private battleFieldHandMapRepository = BattleFieldHandMapRepositoryImpl.getInstance()
    private battleFieldHandSceneRepository = BattleFieldHandSceneRepository.getInstance()

    private opponentFieldMapRepository = OpponentFieldMapRepositoryImpl.getInstance()
    private opponentFieldService = OpponentFieldServiceImpl.getInstance()

    private neonShape: NeonShape

    private leftClickDetectService: LeftClickDetectService
    private dragMoveService: DragMoveService
    private mouseDropService: MouseDropService

    private rightClickDetectService: RightClickDetectService

    private keyboardService: KeyboardService

    private yourFieldAreaService = YourFieldAreaServiceImpl.getInstance();
    private opponentFieldAreaService = OpponentFieldAreaServiceImpl.getInstance();

    private readonly windowSceneRepository = WindowSceneRepositoryImpl.getInstance();
    private readonly windowSceneService = WindowSceneServiceImpl.getInstance(this.windowSceneRepository);

    private readonly cameraRepository = CameraRepositoryImpl.getInstance()
    private readonly cameraService = CameraServiceImpl.getInstance(this.cameraRepository)

    private initialized = false;
    private isAnimating = false;

    private userWindowSize: UserWindowSize;

    constructor(simulationBattleFieldContainer: HTMLElement) {
        this.simulationBattleFieldContainer = simulationBattleFieldContainer;
        this.scene = this.windowSceneService.createScene('battle-field')
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.simulationBattleFieldContainer.appendChild(this.renderer.domElement);

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
        this.audioController.setMusic(battleFieldMusic);

        this.neonShape = NeonShape.getInstance(this.scene, this.renderer, this.camera);

        window.addEventListener('resize', this.onWindowResize.bind(this));

        this.mouseController = new MouseController(this.camera, this.scene);

        window.addEventListener('click', () => this.initializeAudio(), { once: true });

        this.leftClickDetectService = LeftClickDetectServiceImpl.getInstance(this.camera, this.scene)
        this.dragMoveService = DragMoveServiceImpl.getInstance(this.camera, this.scene)
        this.mouseDropService = MouseDropServiceImpl.getInstance()

        this.rightClickDetectService = RightClickDetectServiceImpl.getInstance(this.camera, this.scene)

        this.renderer.domElement.addEventListener('mousedown', async (e) => {
            if (e.button === 0) { // 좌클릭만 처리
                const result = await this.leftClickDetectService.handleLeftClick(e);
                // console.log(`result: ${JSON.stringify(result, null, 2)}`)
                if (result !== null) {
                    this.leftClickDetectService.setLeftMouseDown(true);
                }
            } else if (e.button === 2) { // 우클릭 처리
                e.preventDefault();
                const result = await this.rightClickDetectService.handleRightClick(e);
                if (result !== null) {
                    this.rightClickDetectService.setRightMouseDown(true);
                }

                // TODO: Active Panel 생성
                // const width = 200;
                // const height = 200;
                // const geometry = new THREE.PlaneGeometry(width, height);
                // const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, depthTest: false });
                //
                // let rightClickOverlay = new THREE.Mesh(geometry, material);
                // rightClickOverlay.renderOrder = 1
                //
                // // 클릭한 위치에 배치
                // const vector = new THREE.Vector3(
                //     (e.x / window.innerWidth) * 2 - 1,
                //     -(e.y / window.innerHeight) * 2 + 1,
                //     0
                // );
                // vector.unproject(this.camera);
                // rightClickOverlay.position.copy(vector);
                //
                // this.scene.add(rightClickOverlay);
            }
        }, false)

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (this.dragMoveService.getLeftClickedArea() === LeftClickedArea.YOUR_HAND && this.leftClickDetectService.isLeftMouseDown()) {
                this.dragMoveService.onMouseMove(e);
            }
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            if (this.dragMoveService.getLeftClickedArea() === LeftClickedArea.YOUR_HAND && this.leftClickDetectService.isLeftMouseDown()) {
                this.mouseDropService.onMouseUp();
                this.leftClickDetectService.setLeftMouseDown(false); // 드롭 후 상태 초기화
            }
        }, false);

        this.keyboardService = KeyboardServiceImpl.getInstance()

        document.addEventListener("keydown", (event) => {
            console.log(`Key pressed: ${event.key}`); // 키가 눌릴 때 메시지가 출력되는지 확인
            this.keyboardService.processKeyboard(event.key);
        });

        this.renderer.domElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        }, false);
    }

    public static getInstance(lobbyContainer: HTMLElement): TCGJustTestBattleFieldView {
        if (!TCGJustTestBattleFieldView.instance) {
            TCGJustTestBattleFieldView.instance = new TCGJustTestBattleFieldView(lobbyContainer);
        }
        return TCGJustTestBattleFieldView.instance;
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

        await this.addBackground();
        this.addYourField();
        this.addOpponentField();
        this.addYourHandUnitList()
        this.addOpponentFieldUnitList()

        this.initialized = true;
        this.isAnimating = true;

        this.animate();
    }

    public show(): void {
        console.log('Showing TCGMainLobbyView...');
        this.renderer.domElement.style.display = 'block';
        this.simulationBattleFieldContainer.style.display = 'block';
        this.isAnimating = true;
        if (!this.initialized) {
            this.initialize(); // 초기화되지 않은 경우 초기화 호출
        } else {
            this.animate(); // 이미 초기화된 경우 애니메이션만 다시 시작
        }
    }

    public hide(): void {
        console.log('Hiding TCGMainLobbyView...');
        this.isAnimating = false;
        this.renderer.domElement.style.display = 'none';
        this.simulationBattleFieldContainer.style.display = 'none';
    }

    private async addBackground(): Promise<void> {
        try {
            const background = await this.backgroundService.createBackground(
                'battle_field_background',
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

    private addYourField(): void {
        const yourField = this.yourFieldAreaService.createYourField()
        const yourFieldAreaMesh = yourField.getArea()

        this.scene.add(yourFieldAreaMesh);
    }

    private addOpponentField(): void {
        const opponentField = this.opponentFieldAreaService.createOpponentField()
        const opponentFieldAreaMesh = opponentField.getArea()

        this.scene.add(opponentFieldAreaMesh);
    }

    private async addYourHandUnitList(): Promise<void> {
        const battleFieldHandList = this.battleFieldHandMapRepository.getBattleFieldHandList()

        for (const handCardId of battleFieldHandList) {
            const createdHand = await this.battleFieldHandService.createHand(handCardId)

            if (createdHand) {
                this.battleFieldHandSceneRepository.addBattleFieldHandScene(createdHand);
                this.scene.add(createdHand);
            }
        }
    }

    private async addOpponentFieldUnitList(): Promise<void> {
        const opponentFieldUnitList = this.opponentFieldMapRepository.getOpponentFieldList()
        console.log(`opponentFieldUnitList: ${opponentFieldUnitList}`)

        for (const opponentCardId of opponentFieldUnitList) {
            const opponentFieldUnit = await this.opponentFieldService.createFieldUnit(opponentCardId)
            this.scene.add(opponentFieldUnit);

            // if (opponentFieldUnit) {
            //     this.opponentFieldSceneRepository.addOpponentFieldScene(opponentFieldUnit);
            //     this.scene.add(opponentFieldUnit);
            // }
        }
    }

    private async addBlueNeonLine(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        const color = 0x3137FD; // 네온 블루 색상
        const lineWidth = 10; // 선 두께

        // 선의 시작점과 끝점 설정
        const points = [
            new THREE.Vector3(startX, startY, 4),
            new THREE.Vector3(endX, endY, 4)
        ];

        // 선의 방향과 길이 계산
        const direction = new THREE.Vector3().subVectors(points[1], points[0]);
        const length = direction.length();
        direction.normalize();

        // 선의 재질 설정 (발광 효과를 위해 emissive 사용)
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });

        // 선을 나타내는 얇은 사각형 기하학을 생성
        const geometry = new THREE.PlaneGeometry(length, lineWidth);

        // 선을 생성하고 장면에 추가
        const line = new THREE.Mesh(geometry, material);
        const angle = Math.atan2(direction.y, direction.x);
        line.rotation.z = angle;  // 선의 회전 적용

        // 선의 위치 조정
        line.position.copy(points[0].clone().add(direction.multiplyScalar(length / 2)));

        this.scene.add(line);

        // 블룸 효과를 적용
        this.applyGlowEffect(line);
    }

    private applyGlowEffect(line: THREE.Mesh): void {
        const composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        composer.addPass(renderPass);

        // 블룸 효과를 위한 패스 추가
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.renderer.domElement.width, this.renderer.domElement.height),
            1.5,   // 블룸 효과 강도
            0.4,   // 블룸 반경
            0.85   // 블룸 임계값
        );
        composer.addPass(bloomPass);

        // 마스크 패스를 사용하여 선에만 블룸 효과를 적용
        const maskPass = new MaskPass(this.scene, this.camera);
        composer.addPass(maskPass);

        maskPass.enabled = true;
        this.scene.traverse((object) => {
            if (object !== line) {
                object.visible = false; // 선 외의 모든 객체를 숨김
            }
        });

        // 두 번째 렌더 패스를 사용하여 블룸 효과가 적용된 선을 렌더링
        const renderPass2 = new RenderPass(this.scene, this.camera);
        composer.addPass(renderPass2);

        // 블룸 효과 후 다른 객체의 가시성을 복원
        maskPass.enabled = false;
        this.scene.traverse((object) => {
            object.visible = true;  // 모든 객체의 가시성을 복원
        });

        // 애니메이션 함수 실행
        if (this.isAnimating) {
            requestAnimationFrame(() => this.animate());  // 기존 animate 호출
            composer.render();
        }
    }

    // 사각형을 그리기 위한 메소드
    public async addBlueNeonRectangle(): Promise<void> {
        const rectLength = 100;  // 사각형 한 변의 길이
        const lineWidth = 10;    // 선 두께

        const startX = 50; // 사각형 시작 X 좌표
        const startY = 50; // 사각형 시작 Y 좌표

        // 상단 선
        await this.addBlueNeonLine(
            startX, startY,
            startX + rectLength, startY);

        // 오른쪽 선 (세로로 수정)
        await this.addBlueNeonLine(
            startX + rectLength, startY,
            startX + rectLength, startY + rectLength);

        // 하단 선
        await this.addBlueNeonLine(
            startX + rectLength, startY + rectLength,
            startX, startY + rectLength);

        // 왼쪽 선 (세로로 수정)
        await this.addBlueNeonLine(
            startX, startY + rectLength,
            startX, startY);
    }

    private onWindowResize(): void {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;

        // 기존 크기와 비교해서 변경된 경우만 처리
        if (newWidth !== this.userWindowSize.getWidth() || newHeight !== this.userWindowSize.getHeight()) {
            const aspect = newWidth / newHeight;
            const viewSize = newHeight;

            this.camera.left = -aspect * viewSize / 2;
            this.camera.right = aspect * viewSize / 2;
            this.camera.top = viewSize / 2;
            this.camera.bottom = -viewSize / 2;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(newWidth, newHeight);

            if (this.background) {
                const scaleX = newWidth / this.background.getWidth();
                const scaleY = newHeight / this.background.getHeight();
                this.background.setScale(scaleX, scaleY);
            }

            this.buttons.forEach(button => {
                const initialInfo = this.buttonInitialInfo.get(button.getMesh()?.uuid ?? '');
                if (initialInfo) {
                    const buttonWidth = window.innerWidth * initialInfo.widthPercent;
                    const buttonHeight = window.innerHeight * initialInfo.heightPercent;
                    const newPosition = new THREE.Vector2(
                        window.innerWidth * initialInfo.positionPercent.x,
                        window.innerHeight * initialInfo.positionPercent.y
                    );

                    button.setPosition(newPosition.x, newPosition.y);
                    button.setScale(buttonWidth / button.getWidth(), buttonHeight / button.getHeight());
                }
            });

            // 창 크기 변경에 따라 배틀 필드도 리사이징
            this.userWindowSize.calculateScaleFactors(newWidth, newHeight);
            const { scaleX, scaleY } = this.userWindowSize.getScaleFactors();
            // this.battleFieldHandSceneRepository.resizeHandSceneList(scaleX, scaleY);
            UnitCardGenerator.adjustHandCardPositions();
            SupportCardGenerator.adjustCardPositions()
            ItemCardGenerator.adjustCardPositions()
            EnergyCardGenerator.adjustCardPositions()
        }
    }

    animate(): void {
        if (this.isAnimating) {
            this.neonShape.updateNeonEffect();

            this.renderer.render(this.scene, this.camera);

            requestAnimationFrame(() => this.animate());
        } else {
            console.log('Animation stopped.');
        }
    }
}

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw new Error("Cannot find element with id 'app'.");
}

const userWindowSize = UserWindowSize.getInstance();
const fieldView = TCGJustTestBattleFieldView.getInstance(rootElement);
fieldView.initialize();