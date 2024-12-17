import * as THREE from 'three';
import {IdGenerator} from "../../common/id_generator/IdGenerator";

export class Camera {
    id: number;
    public aspectRatio: number;
    public viewSize: number;
    public camera: THREE.OrthographicCamera;

    constructor(aspectRatio: number, viewSize: number, camera: THREE.OrthographicCamera) {
        this.id = IdGenerator.generateId();
        this.aspectRatio = aspectRatio;
        this.viewSize = viewSize;
        this.camera = camera;
    }

    public getCamera(): THREE.OrthographicCamera {
        return this.camera;
    }

    public getId(): number {
        return this.id
    }

    public getViewSize(): number {
        return this.viewSize
    }

    public getAspectRatio(): number {
        return this.aspectRatio
    }
}
