import * as THREE from "three";
import {getCardById} from "../../card/utility";

import {MyCardScreenCardHoverDetectService} from "./MyCardScreenCardHoverDetectService";
import {MyCardScreenCardHoverDetectRepositoryImpl} from "../repository/MyCardScreenCardHoverDetectRepositoryImpl";
import {MyCardScreenCard} from "../../my_card_screen_card/entity/MyCardScreenCard";
import {MyCardScreenCardRepositoryImpl} from "../../my_card_screen_card/repository/MyCardScreenCardRepositoryImpl";
import {MyCardRaceButtonClickDetectRepositoryImpl} from "../../my_card_race_button_click_detect/repository/MyCardRaceButtonClickDetectRepositoryImpl";

import {CameraRepository} from "../../camera/repository/CameraRepository";
import {CameraRepositoryImpl} from "../../camera/repository/CameraRepositoryImpl";

export class MyCardScreenCardHoverDetectServiceImpl implements MyCardScreenCardHoverDetectService {
    private static instance: MyCardScreenCardHoverDetectServiceImpl | null = null;
    private myCardScreenCardRepository: MyCardScreenCardRepositoryImpl;
    private myCardScreenCardHoverDetectRepository: MyCardScreenCardHoverDetectRepositoryImpl;
    private raceButtonClickDetectRepository: MyCardRaceButtonClickDetectRepositoryImpl;

    private cameraRepository: CameraRepository
    private leftMouseDown: boolean = false;

    private constructor(private camera: THREE.Camera, private scene: THREE.Scene) {
        this.myCardScreenCardRepository = MyCardScreenCardRepositoryImpl.getInstance();
        this.myCardScreenCardHoverDetectRepository = MyCardScreenCardHoverDetectRepositoryImpl.getInstance();
        this.raceButtonClickDetectRepository = MyCardRaceButtonClickDetectRepositoryImpl.getInstance();
        this.cameraRepository = CameraRepositoryImpl.getInstance();
    }

    static getInstance(camera: THREE.Camera, scene: THREE.Scene): MyCardScreenCardHoverDetectServiceImpl {
        if (!MyCardScreenCardHoverDetectServiceImpl.instance) {
            MyCardScreenCardHoverDetectServiceImpl.instance = new MyCardScreenCardHoverDetectServiceImpl(camera, scene);
        }
        return MyCardScreenCardHoverDetectServiceImpl.instance;
    }

    setMouseMove(state: boolean): void {
        this.leftMouseDown = state;
    }

    isMouseMove(): boolean {
        return this.leftMouseDown;
    }

    async handleHover(hoverPoint: { x: number; y: number }): Promise<MyCardScreenCard | null> {
        const { x, y } = hoverPoint;
        const raceButtonId = this.getCurrentClickedRaceButtonId() ?? 0;
        const cardList = this.getCardListByClickedRaceButtonId(raceButtonId);
        if (!cardList) return null;

        const hoveredCard = this.myCardScreenCardHoverDetectRepository.isMyCardScreenCardHover(
            { x, y },
            cardList,
            this.camera
        );

        if (hoveredCard) {
            const cardId = this.getCardIdByCardUniqueId(hoveredCard.id);
            console.log(`[DEBUG] Hovered Card Unique Id: ${hoveredCard.id}, Card ID: ${cardId}`);
            this.saveCurrentHoveredCardId(cardId);

            return hoveredCard;

        }
        return null;
    }

    public async onMouseMove(event: MouseEvent): Promise<MyCardScreenCard | null> {
        if (event.button === 0) {
            const hoverPoint = { x: event.clientX, y: event.clientY };
            return await this.handleHover(hoverPoint);
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

    public getCardIdByCardUniqueId(cardUniqueId: number): number {
        return this.myCardScreenCardRepository.findCardIdByCardUniqueId(cardUniqueId) ?? -1;
    }

    public saveCurrentHoveredCardId(cardId: number): void {
        this.myCardScreenCardHoverDetectRepository.saveCurrentHoveredCardId(cardId);
    }

    public getCurrentHoveredCardId(): number | null {
        return this.myCardScreenCardHoverDetectRepository.findCurrentHoveredCardId();
    }

}
