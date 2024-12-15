import {WindowScene} from "../entity/WindowScene";

export interface WindowSceneRepository {
    add(scene: WindowScene): void;
    getById(id: string): WindowScene | undefined;
    removeById(id: string): void;
    getAll(): WindowScene[];
}
