import {MyDeckButton} from "../my_deck_button/entity/MyDeckButton";
import {MyDeckButtonEffectRepositoryImpl} from "../my_deck_button_effect/repository/MyDeckButtonEffectRepositoryImpl";

export class ButtonPageManager {
    private static instance: ButtonPageManager | null = null;
    private currentPage: number;
    private buttonsPerPage: number;

    private constructor(buttonsPerPage: number = 6) {
        this.currentPage = 1;
        this.buttonsPerPage = buttonsPerPage;
    }

    static getInstance(): ButtonPageManager {
        if (!ButtonPageManager.instance) {
            ButtonPageManager.instance = new ButtonPageManager();
        }
        return ButtonPageManager.instance;
    }

    public getCurrentPage(): number {
        return this.currentPage;
    }

    public setCurrentPage(page: number): void {
        this.currentPage = page;
    }

    public getTotalPages(buttonIdList: number[]): number {
        return Math.ceil(buttonIdList.length / this.buttonsPerPage);
    }

    public resetCurrentPage(): void {
        this.currentPage = 1;
    }

    // 특정 페이지에 해당하는 버튼 id를 반환
    public findButtonIdsForPage(page: number, buttonIdList: number[]): number[] {
        const startIndex = (page - 1) * this.buttonsPerPage;
        const endIndex = Math.min(startIndex + this.buttonsPerPage, buttonIdList.length);
        const buttonIdsInRange = buttonIdList.slice(startIndex, endIndex);

        console.log(`[DEBUG]Current Page: ${page}, ButtonId: ${buttonIdsInRange}`);
        return buttonIdsInRange;

    }

}
