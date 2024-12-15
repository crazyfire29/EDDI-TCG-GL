import {WindowScene} from "../entity/WindowScene";
import {WindowSceneRepository} from "./WindowSceneRepository";

export class WindowSceneRepositoryImpl implements WindowSceneRepository {
    private sceneMap: Map<string, WindowScene> = new Map();

    add(scene: WindowScene): void {
        this.sceneMap.set(scene.id, scene);
    }

    getById(id: string): WindowScene | undefined {
        return this.sceneMap.get(id);
    }

    removeById(id: string): void {
        this.sceneMap.delete(id);
    }

    getAll(): WindowScene[] {
        return Array.from(this.sceneMap.values());
    }
}

