import { NeonBorderLineSceneRepository } from './NeonBorderLineSceneRepository';
import {NeonBorderLineScene} from "../entity/NeonBorderLineScene";


export class NeonBorderLineSceneRepositoryImpl implements NeonBorderLineSceneRepository {
    private static instance: NeonBorderLineSceneRepositoryImpl | null = null;
    private neonBorderLineScenes: Map<number, NeonBorderLineScene> = new Map();

    private constructor() {}

    // 싱글톤 인스턴스 반환
    public static getInstance(): NeonBorderLineSceneRepositoryImpl {
        if (!NeonBorderLineSceneRepositoryImpl.instance) {
            NeonBorderLineSceneRepositoryImpl.instance = new NeonBorderLineSceneRepositoryImpl();
        }
        return NeonBorderLineSceneRepositoryImpl.instance;
    }

    // 네온 라인 씬 저장
    public save(neonBorderLineScene: NeonBorderLineScene): void {
        this.neonBorderLineScenes.set(neonBorderLineScene.getId(), neonBorderLineScene);
    }

    // ID로 네온 라인 씬 조회
    public findById(id: number): NeonBorderLineScene | null {
        return this.neonBorderLineScenes.get(id) || null;
    }

    // 모든 네온 라인 씬 조회
    public findAll(): NeonBorderLineScene[] {
        return Array.from(this.neonBorderLineScenes.values());
    }

    // ID로 네온 라인 씬 삭제
    public deleteById(id: number): void {
        this.neonBorderLineScenes.delete(id);
    }

    // 모든 네온 라인 씬 삭제
    public deleteAll(): void {
        this.neonBorderLineScenes.clear();  // 저장된 모든 항목 삭제
    }
}
