import {WindowScene} from "../entity/WindowScene";

export interface WindowSceneRepository {
    add(scene: WindowScene): void;
    getById(id: number): WindowScene | undefined;
    removeById(id: number): void;
    getAll(): WindowScene[];
}
