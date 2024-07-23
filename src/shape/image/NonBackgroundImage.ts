import * as THREE from 'three';
import { Shape } from '../Shape';

export class NonBackgroundImage extends Shape {
    private textureInitialized: boolean = false;
    private textureId: THREE.Texture | null = null;
    private mesh: THREE.Mesh | null = null;
    private imageSrc: string;

    constructor(
        width: number,
        height: number,
        imageSrc: string,
        private widthRatio: number,
        private heightRatio: number,
        local_translation: THREE.Vector2 = new THREE.Vector2(0, 0),
        global_translation: THREE.Vector2 = new THREE.Vector2(0, 0),
        color: THREE.Color = new THREE.Color(1, 1, 1),
        opacity: number = 1,
        drawBorder: boolean = false,
        isVisible: boolean = true,
        callback?: () => void,
        private renderOrder: number = 0
    ) {
        // super(width, height, local_translation, global_translation, color, opacity, drawBorder, isVisible);
        // // 이미지 텍스처를 로드합니다.
        // const textureLoader = new THREE.TextureLoader();
        // textureLoader.load(imageSrc, (texture) => {
        //     this.textureId = texture;
        //     this.textureInitialized = true;
        //     texture.colorSpace = THREE.SRGBColorSpace;
        //     texture.magFilter = THREE.LinearFilter; // 확대 시에 최근접 필터링 사용
        //     texture.minFilter = THREE.LinearFilter; // 축소 시에 최근접 필터링 사용
        //     texture.generateMipmaps = false;
        //     // 콜백 함수가 제공되었다면 실행합니다.
        //     if (callback) {
        //         callback();
        //     }
        // });
        super(width, height, local_translation, global_translation, color, opacity, drawBorder, isVisible);
        this.imageSrc = imageSrc
        this.loadTexture(callback);
    }

    public loadTexture(callback?: () => void): void {
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(this.imageSrc, (texture) => {
            this.textureId = texture;
            this.textureInitialized = true;
            texture.colorSpace = THREE.SRGBColorSpace;
            // texture.colorSpace = THREE.NoColorSpace;
            texture.magFilter = THREE.LinearFilter; // 확대 시에 최근접 필터링 사용
            texture.minFilter = THREE.LinearFilter; // 축소 시에 최근접 필터링 사용
            texture.generateMipmaps = false;
            if (callback) {
                callback();
            }
        });
    }

    public draw(scene: THREE.Scene): void {
        if (!this.textureInitialized || !this.textureId) {
            // 텍스처가 아직 준비되지 않았거나 로드되지 않은 경우, 아무 것도 하지 않습니다.
            console.log('Texture not initialized');
            return;
        }

        // 이미지 텍스처를 이용하여 투명한 배경을 가진 재질을 만듭니다.
        if (!this.mesh) {
            const material = new THREE.MeshBasicMaterial({
                map: this.textureId,
                transparent: true,
                opacity: this.getOpacity(),
            });

            // PlaneGeometry를 생성합니다.
            const geometry = new THREE.PlaneGeometry(this.getWidth(), this.getHeight());

            // Mesh를 생성합니다.
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.renderOrder = this.renderOrder

            // local_translation을 적용하여 위치를 설정합니다.
            this.mesh.position.set(this.getLocalTranslation().x, this.getLocalTranslation().y, 0);
        }

        // Mesh를 장면에 추가합니다.
        if (!scene.children.includes(this.mesh)) {
            scene.add(this.mesh);
        }
    }

    public setWidthRatio(widthRatio: number): void {
        this.widthRatio = widthRatio;
    }

    public setHeightRatio(heightRatio: number): void {
        this.heightRatio = heightRatio;
    }

    public getMesh(): THREE.Mesh {
        return <THREE.Mesh>this.mesh
    }

    public setTexture(texture: THREE.Texture): void {
        this.textureId = texture;
        this.textureInitialized = true;
    }

    public setScale(scaleX: number, scaleY: number): void {
        if (this.mesh) {
            this.mesh.scale.set(scaleX, scaleY, 1);
        }
    }

    public setPosition(x: number, y: number): void {
        this.getLocalTranslation().set(x, y);
        if (this.mesh) {
            this.mesh.position.set(x, y, 0);
        }
    }
}
