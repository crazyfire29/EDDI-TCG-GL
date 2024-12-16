import {WindowScene} from "../entity/WindowScene";
import {WindowSceneRepository} from "./WindowSceneRepository";

export class WindowSceneRepositoryImpl implements WindowSceneRepository {
    private static instance: WindowSceneRepositoryImpl;
    private sceneMap: Map<number, WindowScene> = new Map();

    private constructor() {}

    public static getInstance(): WindowSceneRepositoryImpl {
        if (!WindowSceneRepositoryImpl.instance) {
            WindowSceneRepositoryImpl.instance = new WindowSceneRepositoryImpl();
        }
        return WindowSceneRepositoryImpl.instance;
    }

    add(scene: WindowScene): void {
        this.sceneMap.set(scene.getId(), scene);
    }

    getById(id: number): WindowScene | undefined {
        return this.sceneMap.get(id);
    }

    removeById(id: number): void {
        this.sceneMap.delete(id);
    }

    getAll(): WindowScene[] {
        return Array.from(this.sceneMap.values());
    }
}

