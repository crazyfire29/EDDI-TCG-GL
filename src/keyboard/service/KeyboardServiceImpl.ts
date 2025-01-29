import { KeyboardService } from "./KeyboardService";
import {KeyboardRepository} from "../repository/KeyboardRepository";
import {KeyboardRepositoryImpl} from "../repository/KeyboardRepositoryImpl";

export class KeyboardServiceImpl implements KeyboardService {
    private static instance: KeyboardServiceImpl | null = null;
    private repository: KeyboardRepository;

    private constructor() {
        this.repository = KeyboardRepositoryImpl.getInstance();
    }

    static getInstance(): KeyboardServiceImpl {
        if (!KeyboardServiceImpl.instance) {
            KeyboardServiceImpl.instance = new KeyboardServiceImpl();
        }
        return KeyboardServiceImpl.instance;
    }

    processKeyboard(key: string): void {
        console.log(`KeyboardServiceImpl processKeyboard(): ${key}`)
        const handler = this.repository.getHandler(key);
        if (handler) {
            handler();
        }
    }
}
