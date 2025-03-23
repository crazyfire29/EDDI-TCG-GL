import * as THREE from 'three';
import {MyCardScrollBarRepository} from './MyCardScrollBarRepository';
import {MyCardScrollBar} from "../entity/MyCardScrollBar";
import {TextureManager} from "../../texture_manager/TextureManager";
import {MeshGenerator} from "../../mesh/generator";
import {Vector2d} from "../../common/math/Vector2d";

export class MyCardScrollBarRepositoryImpl implements MyCardScrollBarRepository {
    private static instance: MyCardScrollBarRepositoryImpl;
    private scrollBarMap: Map<number, MyCardScrollBar> = new Map();
    private textureManager: TextureManager;
    private scrollHandleGroup: THREE.Group | null = null;

    private readonly SCROLL_BAR_WIDTH: number = 0.032
    private readonly SCROLL_BAR_HEIGHT: number = 0.78
    private readonly SCROLL_HANDLE_WIDTH: number = 0.024
    private readonly SCROLL_HANDLE_HEIGHT: number = 0.13

    private constructor(textureManager: TextureManager) {
        this.textureManager = textureManager;
    }

    public static getInstance(): MyCardScrollBarRepositoryImpl {
        if (!MyCardScrollBarRepositoryImpl.instance) {
            const textureManager = TextureManager.getInstance()
            MyCardScrollBarRepositoryImpl.instance = new MyCardScrollBarRepositoryImpl(textureManager);
        }
        return MyCardScrollBarRepositoryImpl.instance;
    }

    public async createScrollBar(type: number, position: Vector2d): Promise<MyCardScrollBar> {
        const texture = await this.textureManager.getTexture('my_card_scroll_bar', type);

        if (!texture) {
            console.error('Failed to load texture for type:', type);
            throw new Error('My Card Close Button texture not found.');
        }

        let width, height;

        if (type === 1) {
            width = this.SCROLL_BAR_WIDTH * window.innerWidth;
            height = this.SCROLL_BAR_HEIGHT * window.innerHeight;

        } else if (type === 2) {
            width = this.SCROLL_HANDLE_WIDTH * window.innerWidth;
            height = this.SCROLL_HANDLE_HEIGHT * window.innerHeight;

        } else {
            console.error('Invalid type:', type);
            throw new Error('Invalid My Card Scroll Bar type.');
        }

        const positionX = position.getX() * window.innerWidth;
        const positionY = position.getY() * window.innerHeight;

        const scrollBarMesh = MeshGenerator.createMesh(texture, width, height, position);
        scrollBarMesh.position.set(positionX, positionY, 0);

        const newScrollBar = new MyCardScrollBar(type, width, height, scrollBarMesh, position);
        this.scrollBarMap.set(newScrollBar.id, newScrollBar);

        return newScrollBar;
    }

    public findScrollBarById(id: number): MyCardScrollBar | null {
        return this.scrollBarMap.get(id) || null;
    }

    public findAllScrollBar(): MyCardScrollBar[] {
        return Array.from(this.scrollBarMap.values());
    }

    public findScrollHandleGroup(): THREE.Group {
        if (!this.scrollHandleGroup) {
            this.scrollHandleGroup = new THREE.Group();
            const scrollHandle = this.findScrollBarById(1);
            if (scrollHandle) {
                this.scrollHandleGroup!.add(scrollHandle.getMesh());
            }
        }
        return this.scrollHandleGroup;
    }

    public deleteById(id: number): void {
        this.scrollBarMap.delete(id);
    }

    public deleteAll(): void {
        this.scrollBarMap.clear();
    }

    public findAllScrollBarIds(): number[] {
        return Array.from(this.scrollBarMap.keys());
    }

    public hideScrollBar(id: number): void {
        const scrollBar = this.findScrollBarById(id);
        if (scrollBar) {
            scrollBar.getMesh().visible = false;
        }
    }

    public showScrollBar(id: number): void {
        const scrollBar = this.findScrollBarById(id);
        if (scrollBar) {
            scrollBar.getMesh().visible = true;
        }
    }
}
