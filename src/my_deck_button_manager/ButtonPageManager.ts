import {MyDeckButton} from "../my_deck_button/entity/MyDeckButton";
import {ButtonStateManager} from "./ButtonStateManager";
import {ButtonEffectManager} from "./ButtonEffectManager";
import {MyDeckButtonEffectRepositoryImpl} from "../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

export class ButtonPageManager {
    private currentPage: number;
    private buttonsPerPage: number;
    private buttonStateManager: ButtonStateManager;
    private buttonEffectManager: ButtonEffectManager;
    private myDeckButtonEffectRepository: MyDeckButtonEffectRepositoryImpl;

    constructor(private allButtonsMap: Map<number, MyDeckButton>, buttonsPerPage: number = 6) {
        this.currentPage = 1;
        this.buttonsPerPage = buttonsPerPage;
        this.buttonStateManager = new ButtonStateManager();
        this.buttonEffectManager = new ButtonEffectManager();
        this.myDeckButtonEffectRepository = MyDeckButtonEffectRepositoryImpl.getInstance();

        Array.from(this.allButtonsMap.keys()).forEach((id) => {
            this.buttonStateManager.setVisibility(id, false); // 모든 버튼을 숨김 상태로 초기화
        });
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    // 특정 페이지에 해당하는 버튼 id를 반환
    public getButtonsIdForPage(page: number): number[] {
        const allIds = Array.from(this.allButtonsMap.keys()).sort((a, b) => a - b);

        const startIndex = (page - 1) * this.buttonsPerPage;
        const endIndex = Math.min(startIndex + this.buttonsPerPage, allIds.length);

        const pageButtonIds = [];
        for (let i = startIndex; i < endIndex; i++) {
            pageButtonIds.push(allIds[i]);
        }
        console.log(`Current Page: ${page}, ButtonIds: ${pageButtonIds}`);
        return pageButtonIds;
    }

    public showButtonsForPage(page: number): void {
        const allIds = Array.from(this.allButtonsMap.keys()).sort((a, b) => a - b);

        const startIndex = (page - 1) * this.buttonsPerPage;
        const endIndex = Math.min(startIndex + this.buttonsPerPage, allIds.length);

        allIds.forEach((id) => {
            const button = this.allButtonsMap.get(id)?.getMesh();
            if (button) {
                button.visible = false;
                this.buttonStateManager.setVisibility(id, false);
            }
        });

        for (let i = startIndex; i < endIndex; i++) {
            const button = this.allButtonsMap.get(allIds[i])?.getMesh();
            if (button && !this.buttonEffectManager.getVisibility(allIds[i])) {
                button.visible = true;
                this.buttonStateManager.setVisibility(allIds[i], true);
            }
        }

        const allEffectButtons = this.myDeckButtonEffectRepository.findAll();
        allEffectButtons.forEach((effectButton) => {
            const mesh = effectButton.getMesh();
            if (mesh && this.buttonEffectManager.getVisibility(effectButton.id)) {
                mesh.visible = true;
            }
        });
    }

    public getTotalPages(): number {
        return Math.ceil(this.allButtonsMap.size / this.buttonsPerPage);
    }
}
