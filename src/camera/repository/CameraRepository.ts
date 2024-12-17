import {Camera} from "../entity/Camera";

export interface CameraRepository {
    save(camera: Camera): void;
    findById(id: number): Camera | null;
    findAll(): Camera[];
    deleteById(id: number): void;
    deleteAll(): void;
    setCameraPosition(camera: Camera, x: number, y: number, z: number): void;
    setCameraLookAt(camera: Camera, x: number, y: number, z: number): void;
    updateCamera(camera: Camera, aspectRatio: number, viewSize: number): void;
}