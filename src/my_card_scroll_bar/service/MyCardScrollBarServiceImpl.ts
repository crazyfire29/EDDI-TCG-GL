import * as THREE from 'three';
import {Vector2d} from "../../common/math/Vector2d";

import {MyCardScrollBarService} from './MyCardScrollBarService';
import {MyCardScrollBar} from "../entity/MyCardScrollBar";
import {MyCardScrollBarRepositoryImpl} from "../repository/MyCardScrollBarRepositoryImpl";

export class MyCardScrollBarServiceImpl implements MyCardScrollBarService {
    private static instance: MyCardScrollBarServiceImpl;
    private myCardScrollBarRepository: MyCardScrollBarRepositoryImpl;

    private constructor() {
        this.myCardScrollBarRepository = MyCardScrollBarRepositoryImpl.getInstance();
    }

    public static getInstance(): MyCardScrollBarServiceImpl {
        if (!MyCardScrollBarServiceImpl.instance) {
            MyCardScrollBarServiceImpl.instance = new MyCardScrollBarServiceImpl();
        }
        return MyCardScrollBarServiceImpl.instance;
    }

    public async createScrollBar(type: number, position: Vector2d): Promise<THREE.Group | null> {
        const scrollBarGroup = new THREE.Group();
        try {
            const scrollBar = await this.myCardScrollBarRepository.createScrollBar(type, position);
            const scrollBarMesh = scrollBar.getMesh();
            scrollBarGroup.add(scrollBarMesh);

        } catch (error) {
            console.error('Error creating My Card Scroll Bar:', error);
            return null;
        }
        return scrollBarGroup;
    }

    public adjustScrollBarPosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const scrollBar = this.getScrollBarById(0);
        if (scrollBar) {
            const scrollBarMesh = scrollBar.getMesh();
            const initialPosition = scrollBar.position;

            const barWidth = 0.032 * windowWidth;
            const barHeight = 0.78 * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            scrollBarMesh.geometry.dispose();
            scrollBarMesh.geometry = new THREE.PlaneGeometry(barWidth, barHeight);

            scrollBarMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    public adjustScrollHandlePosition(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const scrollHandle = this.getScrollBarById(1);
        if (scrollHandle) {
            const scrollHandleMesh = scrollHandle.getMesh();
            const initialPosition = scrollHandle.position;

            const handleWidth = 0.024 * windowWidth;
            const handleHeight = 0.13 * windowHeight;

            const newPositionX = initialPosition.getX() * windowWidth;
            const newPositionY = initialPosition.getY() * windowHeight;

            scrollHandleMesh.geometry.dispose();
            scrollHandleMesh.geometry = new THREE.PlaneGeometry(handleWidth, handleHeight);

            scrollHandleMesh.position.set(newPositionX, newPositionY, 0);
        }
    }

    public getScrollBarById(id: number): MyCardScrollBar | null {
        return this.myCardScrollBarRepository.findScrollBarById(id);
    }

    public deleteScrollBarById(id: number): void {
        this.myCardScrollBarRepository.deleteById(id);
    }

    public deleteAllScrollBars(): void {
        this.myCardScrollBarRepository.deleteAll();
    }

    public initializeScrollBarVisibility(): void {
        const allScrollBarIds = this.myCardScrollBarRepository.findAllScrollBarIds();
        allScrollBarIds.forEach((id) => this.myCardScrollBarRepository.hideScrollBar(id));
    }

    public getScrollHandleGroup(): THREE.Group {
        return this.myCardScrollBarRepository.findScrollHandleGroup();
    }

    public getScrollBarMeshById(id: number): THREE.Mesh | null {
        const scrollBar = this.myCardScrollBarRepository.findScrollBarById(id);
        if (!scrollBar) {
            console.warn(`[WARN] Scroll Bar (ID: ${id}) not found`);
            return null;
        }
        return scrollBar.getMesh();
    }

}
