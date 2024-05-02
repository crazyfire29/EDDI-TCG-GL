import * as THREE from 'three';

export class Rectangle {
    private vertices: THREE.Vector3[];
    private local_translation: THREE.Vector2;
    private global_translation: THREE.Vector2;
    private color: THREE.Vector4; // RGB 및 Alpha 값
    private draw_border: boolean;
    private is_visible: boolean;

    constructor(vertices: THREE.Vector3[], local_translation: THREE.Vector2, global_translation: THREE.Vector2, color: THREE.Vector4, draw_border: boolean, is_visible: boolean) {
        this.vertices = vertices;
        this.local_translation = local_translation;
        this.global_translation = global_translation;
        this.color = color;
        this.draw_border = draw_border;
        this.is_visible = is_visible;
    }

    public getVertices(): THREE.Vector3[] {
        return this.vertices;
    }

    public getLocalTranslation(): THREE.Vector2 {
        return this.local_translation;
    }

    public getGlobalTranslation(): THREE.Vector2 {
        return this.global_translation;
    }

    public getColor(): THREE.Vector4 {
        return this.color;
    }

    public isDrawBorder(): boolean {
        return this.draw_border;
    }

    public isVisible(): boolean {
        return this.is_visible;
    }

    public setVisibility(visible: boolean): void {
        this.is_visible = visible;
    }
}
