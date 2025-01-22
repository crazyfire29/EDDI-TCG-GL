
import { NeonBorderRepository } from "./NeonBorderRepository";
import {NeonBorder} from "../entity/NeonBorder";

export class NeonBorderRepositoryImpl implements NeonBorderRepository {
    private static instance: NeonBorderRepositoryImpl | null = null;
    private storage: Map<number, NeonBorder> = new Map();

    private constructor() {} // private 생성자로 외부에서 인스턴스 생성 불가

    static getInstance(): NeonBorderRepositoryImpl {
        if (!NeonBorderRepositoryImpl.instance) {
            NeonBorderRepositoryImpl.instance = new NeonBorderRepositoryImpl();
        }
        return NeonBorderRepositoryImpl.instance;
    }

    save(neonBorder: NeonBorder): NeonBorder {
        this.storage.set(neonBorder.getId(), neonBorder);
        return neonBorder;
    }

    findById(id: number): NeonBorder | null {
        return this.storage.get(id) || null;
    }

    findAll(): NeonBorder[] {
        return Array.from(this.storage.values());
    }

    deleteById(id: number): void {
        this.storage.delete(id);
    }

    deleteAll(): void {
        this.storage.clear();
    }

    findByCardSceneId(cardSceneId: number): NeonBorder | null {
        for (const neonBorder of this.storage.values()) {
            if (neonBorder.getNeonBorderSceneId() === cardSceneId) {
                return neonBorder;
            }
        }
        return null;
    }
}
