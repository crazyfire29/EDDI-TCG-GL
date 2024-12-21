import { BattleFieldCardAttributeMarkSceneRepository } from './BattleFieldCardAttributeMarkSceneRepository';
import {BattleFieldCardAttributeMarkScene} from "../entity/BattleFieldCardAttributeMarkScene";

export class BattleFieldCardAttributeMarkSceneRepositoryImpl implements BattleFieldCardAttributeMarkSceneRepository {
    private static instance: BattleFieldCardAttributeMarkSceneRepositoryImpl;
    private scenes: BattleFieldCardAttributeMarkScene[] = [];

    private constructor() {}

    public static getInstance(): BattleFieldCardAttributeMarkSceneRepositoryImpl {
        if (!BattleFieldCardAttributeMarkSceneRepositoryImpl.instance) {
            BattleFieldCardAttributeMarkSceneRepositoryImpl.instance = new BattleFieldCardAttributeMarkSceneRepositoryImpl();
        }
        return BattleFieldCardAttributeMarkSceneRepositoryImpl.instance;
    }

    async save(scene: BattleFieldCardAttributeMarkScene): Promise<BattleFieldCardAttributeMarkScene> {
        this.scenes.push(scene);
        return scene;
    }

    async findById(id: number): Promise<BattleFieldCardAttributeMarkScene | null> {
        return this.scenes.find(scene => scene.id === id) || null;
    }

    async findAll(): Promise<BattleFieldCardAttributeMarkScene[]> {
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
