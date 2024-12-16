import { WindowSceneService } from './WindowSceneService';
import { WindowScene } from "../entity/WindowScene";
import { WindowSceneRepository } from "../repository/WindowSceneRepository";
import * as THREE from "three";

export class WindowSceneServiceImpl implements WindowSceneService {
    private static instance: WindowSceneServiceImpl;
    private windowSceneRepository: WindowSceneRepository;

    private constructor(windowSceneRepository: WindowSceneRepository) {
        this.windowSceneRepository = windowSceneRepository;
    }

    public static getInstance(windowSceneRepository: WindowSceneRepository): WindowSceneServiceImpl {
        if (!WindowSceneServiceImpl.instance) {
            WindowSceneServiceImpl.instance = new WindowSceneServiceImpl(windowSceneRepository);
        }
        return WindowSceneServiceImpl.instance;
    }

    createScene(name: string): THREE.Scene {
        const createdScene = new WindowScene(name);
        const scene = createdScene.getScene()
        scene.background = new THREE.Color(0xffffff);
        this.windowSceneRepository.add(createdScene);

        return scene
    }
}
