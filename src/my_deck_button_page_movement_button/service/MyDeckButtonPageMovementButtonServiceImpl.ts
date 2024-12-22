import * as THREE from 'three';
import { MyDeckButtonPageMovementButtonService } from './MyDeckButtonPageMovementButtonService';
import {MyDeckButtonPageMovementButtonType} from "../entity/MyDeckButtonPageMovementButtonType";
import {MyDeckButtonPageMovementButton} from "../entity/MyDeckButtonPageMovementButton";
import {MyDeckButtonPageMovementButtonRepository} from "../repository/MyDeckButtonPageMovementButtonRepository";
import {NonBackgroundImage} from "../../shape/image/NonBackgroundImage";
import {MyDeckButtonPageMovementButtonRepositoryImpl} from "../repository/MyDeckButtonPageMovementButtonRepositoryImpl";
import {Vector2d} from "../../common/math/Vector2d";

export class MyDeckButtonPageMovementButtonServiceImpl implements MyDeckButtonPageMovementButtonService {
    private static instance: MyDeckButtonPageMovementButtonServiceImpl;
    private myDeckButtonPageMovementButtonRepository: MyDeckButtonPageMovementButtonRepository;

    private constructor(myDeckButtonPageMovementButtonRepository: MyDeckButtonPageMovementButtonRepository) {
        this.myDeckButtonPageMovementButtonRepository = myDeckButtonPageMovementButtonRepository;
    }

    public static getInstance(): MyDeckButtonPageMovementButtonServiceImpl {
        if (!MyDeckButtonPageMovementButtonServiceImpl.instance) {
            const myDeckButtonPageMovementButtonRepository = MyDeckButtonPageMovementButtonRepositoryImpl.getInstance();
            MyDeckButtonPageMovementButtonServiceImpl.instance = new MyDeckButtonPageMovementButtonServiceImpl(myDeckButtonPageMovementButtonRepository);
        }
        return MyDeckButtonPageMovementButtonServiceImpl.instance;
    }

    public async createMyDeckButtonPageMovementButton(
        type: MyDeckButtonPageMovementButtonType,
        position: Vector2d
    ): Promise<THREE.Group | null> {
        const buttonGroup = new THREE.Group();
        try {
            const button = await this.myDeckButtonPageMovementButtonRepository.createMyDeckButtonPageMovementButton(type, position);
            const buttonMesh = button.getMesh()
            buttonGroup.add(buttonMesh)
//             return button;

        } catch (error) {
            console.error('Error creating my deck button page movement button:', error);
            return null;
        }
        return buttonGroup;
    }

    public getMyDeckButtonPageMovementButtonById(id: number): MyDeckButtonPageMovementButton | null {
        return this.myDeckButtonPageMovementButtonRepository.findById(id);
    }

    public deleteMyDeckButtonPageMovementButtonById(id: number): void {
        this.myDeckButtonPageMovementButtonRepository.deleteById(id);
    }

    public getAllMyDeckButtonPageMovementButtons(): MyDeckButtonPageMovementButton[] {
        return this.myDeckButtonPageMovementButtonRepository.findAll();
    }

    public deleteAllMyDeckButtonPageMovementButtons(): void {
        this.myDeckButtonPageMovementButtonRepository.deleteAll();
    }
}
