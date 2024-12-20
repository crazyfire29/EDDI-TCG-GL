import * as THREE from 'three';
import { MyDeckCardPageMovementButtonService } from './MyDeckCardPageMovementButtonService';
import {MyDeckCardPageMovementButtonType} from "../entity/MyDeckCardPageMovementButtonType";
import {MyDeckCardPageMovementButton} from "../entity/MyDeckCardPageMovementButton";
import {MyDeckCardPageMovementButtonRepository} from "../repository/MyDeckCardPageMovementButtonRepository";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";
import {MyDeckCardPageMovementButtonRepositoryImpl} from "../repository/MyDeckCardPageMovementButtonRepositoryImpl";

export class MyDeckCardPageMovementButtonServiceImpl implements MyDeckCardPageMovementButtonService {
    private static instance: MyDeckCardPageMovementButtonServiceImpl;
    private myDeckCardPageMovementButtonRepository: MyDeckCardPageMovementButtonRepository;

    private constructor(myDeckCardPageMovementButtonRepository: MyDeckCardPageMovementButtonRepository) {
        this.myDeckCardPageMovementButtonRepository = myDeckCardPageMovementButtonRepository;
    }

    public static getInstance(): MyDeckCardPageMovementButtonServiceImpl {
        if (!MyDeckCardPageMovementButtonServiceImpl.instance) {
            const myDeckCardPageMovementButtonRepository = MyDeckCardPageMovementButtonRepositoryImpl.getInstance();
            MyDeckCardPageMovementButtonServiceImpl.instance = new MyDeckCardPageMovementButtonServiceImpl(myDeckCardPageMovementButtonRepository);
        }
        return MyDeckCardPageMovementButtonServiceImpl.instance;
    }

    public async createMyDeckCardPageMovementButton(
        textureName: string,
        type: MyDeckCardPageMovementButtonType,
        widthPercent: number,
        heightPercent: number,
        positionPercent: THREE.Vector2
    ): Promise<NonBackgroundImage | null> {
        try {
            const button = await this.myDeckCardPageMovementButtonRepository.createMyDeckCardPageMovementButton(
                textureName, type, widthPercent, heightPercent, positionPercent);
            return button;
        } catch (error) {
            console.error('Error creating my deck card page movement button:', error);
            return null;
        }
    }

    public getMyDeckCardPageMovementButtonById(id: number): MyDeckCardPageMovementButton | null {
        return this.myDeckCardPageMovementButtonRepository.findById(id);
    }

    public deleteMyDeckCardPageMovementButtonById(id: number): void {
        this.myDeckCardPageMovementButtonRepository.deleteById(id);
    }

    public getAllMyDeckCardPageMovementButtons(): MyDeckCardPageMovementButton[] {
        return this.myDeckCardPageMovementButtonRepository.findAll();
    }

    public deleteAllMyDeckCardPageMovementButtons(): void {
        this.myDeckCardPageMovementButtonRepository.deleteAll();
    }
}
