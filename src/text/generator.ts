import * as THREE from 'three';

export class TextGenerator {
    private mesh: THREE.Mesh | null = null;
    private textContent?: string;
    private fontSize: number;
    private fontFamily: string;
    private textColor: string;
    private renderOrder: number;
    private position: THREE.Vector2;

    constructor(
        fontSize: number = 64,
        fontFamily: string = 'Verdana',
        textColor: string = '#ffffff',
        position: THREE.Vector2 = new THREE.Vector2(0, 0),
        renderOrder: number = 0
    ) {
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.textColor = textColor;
        this.position = position;
        this.renderOrder = renderOrder;
    }

    public createText(text: string, fontSize?: number, fontFamily?: string, textColor?: string, position?: THREE.Vector2, callback?: () => void): void {
        this.textContent = text;
        if (fontSize) this.fontSize = fontSize;
        if (fontFamily) this.fontFamily = fontFamily;
        if (textColor) this.textColor = textColor;
        if (position) this.position = position;

        this.createMesh();
        if (callback) callback();
    }

    private createMesh(): void {
        if (!this.textContent) {
            console.warn('No text content to create a mesh.');
            return;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            console.error('Failed to get canvas context.');
            return;
        }

        context.font = `${this.fontSize}px ${this.fontFamily}`;
        canvas.width = context.measureText(this.textContent).width;
        canvas.height = this.fontSize * 1.5;
        context.font = `${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = this.textColor;
        context.textBaseline = 'middle';
        context.fillText(this.textContent, 0, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y, 0);
        this.mesh.renderOrder = this.renderOrder;
    }

    public draw(scene: THREE.Scene): void {
        if (!this.mesh) {
            console.warn('No mesh to draw.');
            return;
        }

        if (!scene.children.includes(this.mesh)) {
            scene.add(this.mesh);
        }
    }

    public setPosition(x: number, y: number): void {
        this.position.set(x, y);
        if (this.mesh) {
            this.mesh.position.set(x, y, 0);
        }
    }

    public setTextColor(color: string): void {
        this.textColor = color;
        if (this.textContent) {
            this.createMesh();
        }
    }

    public setFontSize(size: number): void {
        this.fontSize = size;
        if (this.textContent) {
            this.createMesh();
        }
    }

    public getMesh(): THREE.Mesh | null {
        return this.mesh;
    }
}
