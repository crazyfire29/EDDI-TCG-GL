import * as THREE from "three";

export interface WindowSceneService {
    createScene(name: string): THREE.Scene;
}
