import * as THREE from 'three';
import { Shape } from '../Shape'; // Shape 클래스가 정의된 파일의 경로를 정확하게 지정해야 합니다.

export class RectangleImage extends Shape {
    private textureInitialized: boolean = false;
    private textureId: THREE.Texture | null = null;

    constructor(
        width: number,
        height: number,
        imageSrc: string,
        private widthRatio: number,
        private heightRatio: number,
        localTranslation: THREE.Vector2 = new THREE.Vector2(0, 0),
        globalTranslation: THREE.Vector2 = new THREE.Vector2(0, 0),
        color: THREE.Color = new THREE.Color(1, 1, 1),
        opacity: number = 1,
        drawBorder: boolean = false,
        isVisible: boolean = true,
        callback?: () => void // 콜백 함수 추가
    ) {
        super(width, height, localTranslation, globalTranslation, color, opacity, drawBorder, isVisible);
        // 이미지 텍스처를 로드합니다.
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(imageSrc, (texture) => {
            this.textureId = texture;
            this.textureInitialized = true;
            texture.colorSpace = THREE.SRGBColorSpace
            texture.magFilter = THREE.NearestFilter; // 확대 시에 최근접 필터링 사용
            texture.minFilter = THREE.NearestFilter; // 축소 시에 최근접 필터링 사용
            texture.generateMipmaps = false
            // 콜백 함수가 제공되었다면 실행합니다.
            if (callback) {
                callback();
            }
        });
    }

    public draw(scene: THREE.Scene): void {
        if (!this.textureInitialized || !this.textureId) {
            // 텍스처가 아직 준비되지 않았거나 로드되지 않은 경우, 아무 것도 하지 않습니다.
            console.log('there are no texture')
            return;
        }

        // 이미지 텍스처를 이용하여 재질을 만듭니다.
        const material = new THREE.MeshBasicMaterial({ map: this.textureId });

        // PlaneGeometry를 생성합니다.
        const geometry = new THREE.PlaneGeometry(this.getWidth(), this.getHeight());

        // Mesh를 생성합니다.
        const mesh = new THREE.Mesh(geometry, material);

        // Mesh를 장면에 추가합니다.
        scene.add(mesh);
    }

    public setWidthRatio(widthRatio: number): void {
        this.widthRatio = widthRatio;
    }

    public setHeightRatio(heightRatio: number): void {
        this.heightRatio = heightRatio;
    }
}
