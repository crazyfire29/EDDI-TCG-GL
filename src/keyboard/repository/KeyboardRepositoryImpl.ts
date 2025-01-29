import {KeyboardRepository} from "./KeyboardRepository";
import {KeyboardAction} from "../entity/KeyboardAction";

export class KeyboardRepositoryImpl implements KeyboardRepository {
    private static instance: KeyboardRepositoryImpl | null = null;
    private keyTable: Map<string, () => KeyboardAction>;

    private constructor() {
        this.keyTable = new Map([
            ["d", () => {
                console.log(`Action: ${KeyboardAction.DEPLOY}`);
                return KeyboardAction.DEPLOY;
            }],
        ]);
    }

    static getInstance(): KeyboardRepositoryImpl {
        if (!KeyboardRepositoryImpl.instance) {
            KeyboardRepositoryImpl.instance = new KeyboardRepositoryImpl();
        }
        return KeyboardRepositoryImpl.instance;
    }

    getHandler(key: string): (() => KeyboardAction | undefined) | undefined {
        return this.keyTable.get(key);
    }
}
