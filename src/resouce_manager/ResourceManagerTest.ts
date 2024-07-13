import * as THREE from 'three';

interface ImagePaths {
    [key: string]: string[];
}

class ResourceManagerTest {
    private static instance: ResourceManagerTest;
    private textureLoader: THREE.TextureLoader;
    private textures: { [key: string]: THREE.Texture } = {};
    private paths: ImagePaths = {
        card: [],
        weapon: [],
        hp: [],
        energy: [],
        race: []
    };

    private constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.loadPaths();
    }

    public static getInstance(): ResourceManagerTest {
        if (!ResourceManagerTest.instance) {
            ResourceManagerTest.instance = new ResourceManagerTest();
        }
        return ResourceManagerTest.instance;
    }

    private async loadPaths(): Promise<void> {
        const response = await fetch('image-paths.json');
        this.paths = await response.json();
    }

    public async preLoadImages(): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const category in this.paths) {
            promises.push(this.loadImages(category as keyof typeof ResourceManagerTest.instance.paths));
        }
        await Promise.all(promises);
    }

    private async loadImages(category: keyof typeof ResourceManagerTest.instance.paths): Promise<void> {
        const imagePaths = this.paths[category];
        for (const imagePath of imagePaths) {
            this.textureLoader.load(imagePath, (texture) => {
                this.textures[imagePath] = texture;
            });
        }
    }

    public getTexture(category: keyof typeof ResourceManagerTest.instance.paths, id: number): THREE.Texture | null {
        const imagePath = this.paths[category][id];
        return this.textures[imagePath] || null;
    }
}

export { ResourceManagerTest };
