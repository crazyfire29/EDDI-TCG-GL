import {Camera} from "../entity/Camera";
import {CameraRepository} from "./CameraRepository";

export class CameraRepositoryImpl implements CameraRepository {
    private static instance: CameraRepositoryImpl;
    private cameras: Map<number, Camera> = new Map();

    public static getInstance(): CameraRepositoryImpl {
        if (!CameraRepositoryImpl.instance) {
            CameraRepositoryImpl.instance = new CameraRepositoryImpl();
        }
        return CameraRepositoryImpl.instance;
    }

    public save(camera: Camera): void {
        this.cameras.set(camera.getId(), camera);
    }

    public findById(id: number): Camera | null {
        return this.cameras.get(id) || null;
    }

    public findAll(): Camera[] {
        return Array.from(this.cameras.values());
    }

    public deleteById(id: number): void {
        this.cameras.delete(id);
    }

    public deleteAll(): void {
        this.cameras.clear();
    }

    public setCameraPosition(camera: Camera, x: number, y: number, z: number): void {
        const cameraObject = camera.getCamera();
        cameraObject.position.set(x, y, z);
    }

    public setCameraLookAt(camera: Camera, x: number, y: number, z: number): void {
        const cameraObject = camera.getCamera();
        cameraObject.lookAt(x, y, z);
    }

    public updateCamera(camera: Camera, aspectRatio: number, viewSize: number): void {
        camera.aspectRatio = aspectRatio;
        camera.viewSize = viewSize;

        const cameraObject = camera.getCamera();
        cameraObject.left = -camera.aspectRatio * camera.viewSize / 2;
        cameraObject.right = camera.aspectRatio * camera.viewSize / 2;
        cameraObject.top = camera.viewSize / 2;
        cameraObject.bottom = -camera.viewSize / 2;
        cameraObject.updateProjectionMatrix();
    }
}
