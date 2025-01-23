import * as THREE from 'three';
import {DeckMakePopupInputContainerRepository} from './DeckMakePopupInputContainerRepository';
import {DeckMakePopupInputContainer} from "../entity/DeckMakePopupInputContainer";
import {InputContainerGenerator} from "../../input_container/generator";

export class DeckMakePopupInputContainerRepositoryImpl implements DeckMakePopupInputContainerRepository {
    private static instance: DeckMakePopupInputContainerRepositoryImpl;
    private inputContainer: DeckMakePopupInputContainer | null;
    private userInput: string | null;

    private constructor() {
        this.inputContainer = null;
        this.userInput = null;
    }

    public static getInstance(): DeckMakePopupInputContainerRepositoryImpl {
        if (!DeckMakePopupInputContainerRepositoryImpl.instance) {
            DeckMakePopupInputContainerRepositoryImpl.instance = new DeckMakePopupInputContainerRepositoryImpl();
        }
        return DeckMakePopupInputContainerRepositoryImpl.instance;
    }

    public async createDeckMakePopupInputContainer(): Promise<DeckMakePopupInputContainer> {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const containerWidth = 0.25 * windowWidth;
        const containerHeight = 0.05 * windowHeight;
        const containerTop = 0.4975 * windowHeight;
        const containerLeft = 0.387 * windowWidth;
        const containerPosition = { top: containerTop, left: containerLeft };

        const inputWidth = 0.21 * windowWidth;
        const inputHeight = 0.017 * windowHeight;
        const inputFontSize = 0.01 * windowWidth;

        const maxLength = 12;

        const inputContainerMesh = InputContainerGenerator.createInputContainer(
            'Deck Create', // placeholder
            containerWidth, containerHeight, containerPosition,
            inputWidth, inputHeight, inputFontSize,
            maxLength
        );
        const newInputContainer = new DeckMakePopupInputContainer(inputContainerMesh, containerPosition);
        this.inputContainer = newInputContainer;

        return newInputContainer;
    }

    public findDeckMakePopupInputContainer(): DeckMakePopupInputContainer | null {
        return this.inputContainer;
    }

    public deleteDeckMakePopupInputContainer(): void {
        this.inputContainer = null;
    }

    public hideDeckMakePopupInputContainer(): void {
        const inputContainer = this.findDeckMakePopupInputContainer();
        if (inputContainer) {
            InputContainerGenerator.setContainerVisible(inputContainer.container, 'none');
        }
    }

    public showDeckMakePopupInputContainer(): void {
        const inputContainer = this.findDeckMakePopupInputContainer();
        if (inputContainer) {
            InputContainerGenerator.setContainerVisible(inputContainer.container, 'block');
        }
    }

    public updateUserInput(): void {
        const inputContainer = this.findDeckMakePopupInputContainer();
        if (inputContainer){
            const inputContainerMesh = inputContainer.getContainer();
            const inputElement = inputContainerMesh.querySelector('input');
            if (inputElement) {
                this.userInput = inputElement.value;
            }
        }
        console.log(`user input: ${this.userInput}`);
    }

    public clearUserInput(): void {
        const inputContainer = this.findDeckMakePopupInputContainer();
        if (inputContainer) {
            const inputContainerMesh = inputContainer.getContainer();
            const inputElement = inputContainerMesh.querySelector('input');
            if (inputElement) {
                inputElement.value = ''; // 입력창의 값을 초기화
            }
        }
    }

    public findUserInput(): string | null {
        console.log(`Current userInput: ${this.userInput}`);
        return this.userInput;
    }

    public deleteUserInput(): void {
        this.userInput = null;
    }

}
