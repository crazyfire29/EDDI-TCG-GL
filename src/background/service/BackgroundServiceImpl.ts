import { BackgroundService } from './BackgroundService';
import {BackgroundType} from "../entity/BackgroundType";
import {Background} from "../entity/Background";
import {BackgroundRepository} from "../repository/BackgroundRepository";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";
import {BackgroundRepositoryImpl} from "../repository/BackgroundRepositoryImpl";

export class BackgroundServiceImpl implements BackgroundService {
    private static instance: BackgroundServiceImpl;
    private backgroundRepository: BackgroundRepository;

    private constructor(backgroundRepository: BackgroundRepository) {
        this.backgroundRepository = backgroundRepository;
    }

    public static getInstance(): BackgroundServiceImpl {
        if (!BackgroundServiceImpl.instance) {
            const backgroundRepository = BackgroundRepositoryImpl.getInstance();
            BackgroundServiceImpl.instance = new BackgroundServiceImpl(backgroundRepository);
        }
        return BackgroundServiceImpl.instance;
    }

    public async createBackground(
        textureName: string,
        type: BackgroundType,
        width: number,
        height: number
    ): Promise<NonBackgroundImage | null> {
        try {
            const background = await this.backgroundRepository.createBackground(textureName, type, width, height);
            return background;
        } catch (error) {
            console.error('Error creating background:', error);
            return null;
        }
    }

    public getBackgroundById(id: number): Background | null {
        return this.backgroundRepository.findById(id);
    }

    public deleteBackgroundById(id: number): void {
        this.backgroundRepository.deleteById(id);
    }

    public getAllBackgrounds(): Background[] {
        return this.backgroundRepository.findAll();
    }

    public deleteAllBackgrounds(): void {
        this.backgroundRepository.deleteAll();
    }
}
