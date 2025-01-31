import {OpponentFieldCardAttributeMarkSceneRepository} from "./OpponentFieldCardAttributeMarkSceneRepository";
import {OpponentFieldCardAttributeMarkScene} from "../entity/OpponentFieldCardAttributeMarkScene";

export class OpponentFieldCardAttributeMarkSceneRepositoryImpl implements OpponentFieldCardAttributeMarkSceneRepository {
    private static instance: OpponentFieldCardAttributeMarkSceneRepositoryImpl;
    private scenes: OpponentFieldCardAttributeMarkScene[] = [];

    private constructor() {}

    public static getInstance(): OpponentFieldCardAttributeMarkSceneRepositoryImpl {
        if (!OpponentFieldCardAttributeMarkSceneRepositoryImpl.instance) {
            OpponentFieldCardAttributeMarkSceneRepositoryImpl.instance = new OpponentFieldCardAttributeMarkSceneRepositoryImpl();
        }
        return OpponentFieldCardAttributeMarkSceneRepositoryImpl.instance;
    }

    async save(scene: OpponentFieldCardAttributeMarkScene): Promise<OpponentFieldCardAttributeMarkScene> {
        this.scenes.push(scene);
        return scene;
    }

    async findById(id: number): Promise<OpponentFieldCardAttributeMarkScene | null> {
        // console.log(`BattleFieldCardAttributeMarkSceneRepositoryImpl: Current scenes -> ${JSON.stringify(this.scenes, null, 2)}`);
        return this.scenes.find(scene => scene.id === id) || null;
    }

    async findAll(): Promise<OpponentFieldCardAttributeMarkScene[]> {
        return this.scenes;
    }

    async deleteById(id: number): Promise<boolean> {
        const index = this.scenes.findIndex(scene => scene.id === id);
        if (index !== -1) {
            this.scenes.splice(index, 1);
            return true;
        }
        return false;
    }

    async deleteAll(): Promise<void> {
        this.scenes = [];
    }
}
