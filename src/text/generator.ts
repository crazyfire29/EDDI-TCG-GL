import * as THREE from 'three';

export class TextGenerator {
    private mesh: THREE.Mesh | null = null;
    private textContent?: string;
    private fontSize: number;
    private fontFamily: string;
    private textColor: string;

    constructor(
        fontSize: number = 64,
        fontFamily: string = 'Verdana',
        textColor: string = '#ffffff',
    ) {
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.textColor = textColor;
    }

    public static createText(
        text: string,
        fontSize: number = 64,
        fontFamily: string = 'Verdana',
        textColor: string = '#ffffff',)
        : THREE.CanvasTexture | null
        {
            if (!text) {
                console.warn('No text content to create a texture.');
                return null;
            }

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) {
                console.error('Failed to get canvas context.');
                return null;
            }

            context.font = `${fontSize}px ${fontFamily}`;
            canvas.width = context.measureText(text).width;
            canvas.height = fontSize * 1.5;
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = textColor;
            context.textBaseline = 'middle';
            context.fillText(text, 0, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;

            return texture;
    }

}
