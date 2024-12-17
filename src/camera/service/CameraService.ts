import {Camera} from "../entity/Camera";
import * as THREE from "three";

export interface CameraService {
    createCamera(aspectRatio: number, viewSize: number): Camera;
    getOrthographicCameraById(id: number): THREE.OrthographicCamera | null;
    getAllCameras(): Camera[];
    deleteCameraById(id: number): void;
    deleteAllCameras(): void;
}
