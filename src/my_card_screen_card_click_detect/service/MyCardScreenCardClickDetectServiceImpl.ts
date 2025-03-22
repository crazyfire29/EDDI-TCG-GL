import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {MyCardScreenCardClickDetectService} from "./MyCardScreenCardClickDetectService";
import {MyCardScreenCardClickDetectRepositoryImpl} from "../repository/MyCardScreenCardClickDetectRepositoryImpl";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";
import {MyCardScreenCardRepositoryImpl} from "../../my_card_screen_card/repository/MyCardScreenCardRepositoryImpl";
import {MyCardRaceButtonClickDetectRepositoryImpl} from "../../my_card_race_button_click_detect/repository/MyCardRaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class MyCardScreenCardClickDetectServiceImpl implements MyCardScreenCardClickDetectService {
    private static instance: MyCardScreenCardClickDetectServiceImpl | null = null;
    private myCardScreenCardRepository: MyCardScreenCardRepositoryImpl;
    private myCardScreenCardClickDetectRepository: MyCardScreenCardClickDetectRepositoryImpl;
    private raceButtonClickDetectRepository: MyCardRaceButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository;
    private mouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myCardScreenCardRepository = MyCardScreenCardRepositoryImpl.getInstance();
        this.myCardScreenCardClickDetectRepository = MyCardScreenCardClickDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = MyCardRaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyCardScreenCardClickDetectServiceImpl {
        if (!MyCardScreenCardClickDetectServiceImpl.instance) {
            MyCardScreenCardClickDetectServiceImpl.instance = new MyCardScreenCardClickDetectServiceImpl(camera, scene);
        }
        return MyCardScreenCardClickDetectServiceImpl.instance;
    }

    setMouseDown(state: boolean): void {
        this.mouseDown = state;
    }

    isMouseDown(): boolean {
        return this.mouseDown;
    }

    async handleLeftClick(clickPoint: { x: number; y: number }): Promise<MyCardScreenCard | null> {
        const { x, y } = clickPoint;
        const raceButtonId = this.getCurrentClickedRaceButtonId() ?? 0;
        const cardIdList = this.getCardIdListByClickedRaceButtonId(raceButtonId);
        const cardList = this.getCardListByClickedRaceButtonId(raceButtonId);
        if (!cardList) return null;

        const clickedCard = this.myCardScreenCardClickDetectRepository.isMyCardScreenCardClicked(
            { x, y },
            cardList,
            this.camera
        );

        if (clickedCard) {
            const cardId = this.getCardIdByCardUniqueId(clickedCard.id);
            console.log(`[DEBUG] Clicked Card Unique Id: ${clickedCard.id}, Card ID: ${cardId}`);
            this.saveCurrentClickedCardId(cardId);

            return clickedCard;

        }
        return null;
    }

    public async onMouseDown(event: MouseEvent): Promise<MyCardScreenCard | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleLeftClick(hoverPoint);
        }
        return null;
    }

    public getCurrentClickedRaceButtonId(): number | null {
        return this.raceButtonClickDetectRepository.findCurrentClickedRaceButtonId();
    }

    public getCardListByClickedRaceButtonId(raceButtonId: number): MyCardScreenCard[] | null {
        const raceId = (raceButtonId + 1).toString();
        return this.myCardScreenCardRepository.findCardListByRaceId(raceId);
    }

    private getCardIdListByClickedRaceButtonId(raceButtonId: number): number[] {
        const raceId = (raceButtonId + 1).toString();
        return this.myCardScreenCardRepository.findCardIdsByRaceId(raceId);
    }

    public getCardIdByCardUniqueId(cardUniqueId: number): number {
        return this.myCardScreenCardRepository.findCardIdByCardUniqueId(cardUniqueId) ?? -1;
    }

    public saveCurrentClickedCardId(cardId: number): void {
        this.myCardScreenCardClickDetectRepository.saveCurrentClickedCardId(cardId);
    }

    public getCurrentClickedCardId(): number | null {
        return this.myCardScreenCardClickDetectRepository.findCurrentClickedCardId();
    }

}
