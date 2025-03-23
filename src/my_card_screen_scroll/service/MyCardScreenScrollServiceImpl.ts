import * as THREE from "three";

import {MyCardScreenScrollService} from "./MyCardScreenScrollService";
import {MyCardScreenCardRepositoryImpl} from "../../my_card_screen_card/repository/MyCardScreenCardRepositoryImpl";
import {MyCardScreenCardEffectRepositoryImpl} from "../../my_card_screen_card_effect/repository/MyCardScreenCardEffectRepositoryImpl";
import {MyCardRaceButtonClickDetectRepositoryImpl} from "../../my_card_race_button_click_detect/repository/MyCardRaceButtonClickDetectRepositoryImpl";
import {MyCardScrollBarRepositoryImpl} from "../../my_card_scroll_bar/repository/MyCardScrollBarRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class MyCardScreenScrollServiceImpl implements MyCardScreenScrollService {
    private static instance: MyCardScreenScrollServiceImpl | null = null;
    private renderer: THREE.WebGLRenderer;
    private cameraRepository: CameraRepository;
    private myCardScreenCardRepository: MyCardScreenCardRepositoryImpl;
    private myCardScreenCardEffectRepository: MyCardScreenCardEffectRepositoryImpl;
    private raceButtonClickDetectRepository: MyCardRaceButtonClickDetectRepositoryImpl;
    private myCardScrollBarRepository : MyCardScrollBarRepositoryImpl;

    private scrollState: boolean = true;

    private constructor(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
        this.cameraRepository = CameraRepositoryImpl.getInstance();
        this.myCardScreenCardRepository = MyCardScreenCardRepositoryImpl.getInstance();
        this.myCardScreenCardEffectRepository = MyCardScreenCardEffectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = MyCardRaceButtonClickDetectRepositoryImpl.getInstance();
        this.myCardScrollBarRepository = MyCardScrollBarRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer): MyCardScreenScrollServiceImpl {
        if (!MyCardScreenScrollServiceImpl.instance) {
            MyCardScreenScrollServiceImpl.instance = new MyCardScreenScrollServiceImpl(camera, scene, renderer);
        }
        return MyCardScreenScrollServiceImpl.instance;
    }

    public setScrollState(state: boolean): void {
        this.scrollState = state;
    }

    public getScrollState(): boolean {
        return this.scrollState;
    }

    public async onWheelScroll(event: WheelEvent, currentClickRaceButtonId: number): Promise<void> {
        const scrollTargetCard = this.getCardGroupsByRaceId(currentClickRaceButtonId); // 종족별로 카드 가져옴
        const scrollTargetCardEffect = this.getCardEffectGroupsByRaceId(currentClickRaceButtonId);
        const cardRowCount = this.getCardRowCountByRaceButtonId(currentClickRaceButtonId); // 카드 행의 갯수

        console.log("Scroll Target Card Group:", scrollTargetCard);
        console.log("Scroll Target Children Count:", scrollTargetCard.children.length);
        console.log(`card Row Count?${cardRowCount}`);

        const scrollTargetHandle = this.getScrollHandleGroup();

        if (!scrollTargetCard && !scrollTargetCardEffect) return;
        if (!scrollTargetHandle) return;

        console.log(`Before Scroll- scrollTarget.position: ${scrollTargetCard.position.y}`);

        event.preventDefault(); // 기본 스크롤 방지

        const scrollSpeed = 0.2;
        scrollTargetCard.position.y += event.deltaY * scrollSpeed;
        scrollTargetCardEffect.position.y += event.deltaY * scrollSpeed;
        scrollTargetHandle.position.y -= event.deltaY * 0.3;

        const lowerLimit = 0.401 * window.innerHeight * (cardRowCount - 2); // 보이지 않는 카드가 차지하는 전체 높이
        const upperLimit = 0;
        console.log(`upperLimit: ${upperLimit}`); // 최대로 올릴 수 있는 범위
        console.log(`lowerLimit: ${lowerLimit}`); // 최대로 내릴 수 있는 범위
        const handleLowerLimit = -(0.78 - 0.13 * 2 + 0.13 / 2 + 0.015) * window.innerHeight; // 스크롤 바 높이 - 스크롤 핸들 높이 * 2

        scrollTargetCard.position.y = Math.max(Math.min(scrollTargetCard.position.y, lowerLimit), upperLimit);
        console.log('After Scroll- scrollTarget.position.y', scrollTargetCard.position.y);
        scrollTargetCardEffect.position.y = Math.max(Math.min(scrollTargetCardEffect.position.y, lowerLimit), upperLimit);
        scrollTargetHandle.position.y = Math.min(Math.max(scrollTargetHandle.position.y, handleLowerLimit), upperLimit);
    }

    private getCardGroupsByRaceId(raceButtonId: number): THREE.Group {
        const raceId = raceButtonId + 1;

        switch (raceId) {
            case 1:
                return this.myCardScreenCardRepository.findHumanCardGroup();
            case 2:
                return this.myCardScreenCardRepository.findUndeadCardGroup();
            case 3:
                return this.myCardScreenCardRepository.findTrentCardGroup();
            default:
                console.warn(`[WARN] Invalid raceButtonId: ${raceButtonId}, returning empty group`);
                return new THREE.Group();
        }
    }

    private getCardEffectGroupsByRaceId(raceButtonId: number): THREE.Group {
        const raceId = raceButtonId + 1;

        switch (raceId) {
            case 1:
                return this.myCardScreenCardEffectRepository.findHumanEffectGroup();
            case 2:
                return this.myCardScreenCardEffectRepository.findUndeadEffectGroup();
            case 3:
                return this.myCardScreenCardEffectRepository.findTrentEffectGroup();
            default:
                console.warn(`[WARN] Invalid raceButtonId: ${raceButtonId}, returning empty group`);
                return new THREE.Group();
        }
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    public getCardRowCountByRaceButtonId(raceButtonId: number): number {
        const raceId = (raceButtonId + 1).toString();
        const cardCountByRaceId = this.myCardScreenCardRepository.getCardCountByRaceId(raceId);
        const rowCount = Math.ceil(cardCountByRaceId / 5);

        return rowCount;
    }

    public getCardCountByRaceId(raceButtonId: number): number {
        const raceId = (raceButtonId + 1).toString();
        return this.myCardScreenCardRepository.getCardCountByRaceId(raceId);
    }

    public getScrollHandleGroup(): THREE.Group {
        return this.myCardScrollBarRepository.findScrollHandleGroup();
    }

}
