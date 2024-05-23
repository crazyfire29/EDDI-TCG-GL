import * as THREE from 'three';
export class Rectangle extends THREE.Mesh {
    constructor(color, vertices, material, global_translation = [0, 0], local_translation = [0, 0]) {
        super();
        this.initial_vertices = null;
        this.initial_center = null;
        this.width_ratio = 1;
        this.height_ratio = 1;
        this.attached_shapes = [];
        this.__rectangle_kinds = null;
        this.draw_border = true;
        this.draw_gradient = false;
        this.is_visible = true;
        this.color = color;
        this.vertices = vertices;
        this.global_translation = global_translation;
        this.local_translation = local_translation;
        this.translation = [local_translation[0] + global_translation[0], local_translation[1] + global_translation[1]];
        this.material = material; // 새로 추가된 재질 파라미터 설정
    }
    setWidthRatio(width_ratio) {
        this.width_ratio = width_ratio;
    }
    setHeightRatio(height_ratio) {
        this.height_ratio = height_ratio;
    }
    setInitialVertices(vertices) {
        this.initial_vertices = vertices;
    }
    getInitialVertices() {
        return this.initial_vertices;
    }
    setInitialCenter(vertices) {
        this.initial_center = [vertices[0][0], vertices[0][1]];
    }
    getInitialCenter() {
        return this.initial_center;
    }
    setAttachedShapes(shape) {
        this.attached_shapes.push(shape);
    }
    getAttachedShapes() {
        return this.attached_shapes;
    }
    setDetachedShape(shape) {
        const index = this.attached_shapes.indexOf(shape);
        if (index !== -1) {
            this.attached_shapes.splice(index, 1);
        }
    }
    localTranslate(local_translate) {
        this.local_translation = local_translate;
    }
    globalTranslate(global_translate) {
        this.global_translation = global_translate;
    }
    setAlpha(new_alpha) {
        // 이전 색상 정보를 가져옵니다.
        const [r, g, b, _] = this.color;
        // 새로운 알파 값을 포함하여 새로운 색상을 설정합니다.
        this.color = [r, g, b, new_alpha];
    }
    updateVertices(new_vertices) {
        this.vertices = new_vertices;
    }
    updateCenter(new_center) {
        this.vertices = [[new_center[0], new_center[1]]];
    }
    getVertices() {
        return this.vertices;
    }
    getLocalTranslation() {
        return this.local_translation;
    }
    draw(scene) {
        if (!this.is_visible) {
            return;
        }
        if (this.draw_border) {
            const borderGeometry = new THREE.BufferGeometry();
            borderGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
                this.vertices[0][0] * this.width_ratio + this.global_translation[0] + this.local_translation[0] * this.width_ratio - 1,
                this.vertices[0][1] * this.height_ratio + this.global_translation[1] + this.local_translation[1] * this.height_ratio - 1,
                0,
                this.vertices[1][0] * this.width_ratio + this.global_translation[0] + this.local_translation[0] * this.width_ratio + 1,
                this.vertices[1][1] * this.height_ratio + this.global_translation[1] + this.local_translation[1] * this.height_ratio - 1,
                0,
                this.vertices[2][0] * this.width_ratio + this.global_translation[0] + this.local_translation[0] * this.width_ratio + 1,
                this.vertices[2][1] * this.height_ratio + this.global_translation[1] + this.local_translation[1] * this.height_ratio + 1,
                0,
                this.vertices[3][0] * this.width_ratio + this.global_translation[0] + this.local_translation[0] * this.width_ratio - 1,
                this.vertices[3][1] * this.height_ratio + this.global_translation[1] + this.local_translation[1] * this.height_ratio + 1,
                0
            ]), 3));
            const borderMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
            const borderLine = new THREE.LineLoop(borderGeometry, borderMaterial);
            scene.add(borderLine);
        }
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        if (this.draw_gradient) {
            const colorVariation = Math.random() * (2.9 - 1.7) + 1.7; // Random number between 1.7 and 2.9
            const coloredBorder = this.color.map(c => c * colorVariation);
            const positions = [];
            const colors = [];
            for (let i = 0; i < this.vertices.length; i++) {
                const vertexX = this.vertices[i][0] * this.width_ratio + this.global_translation[0] + this.local_translation[0] * this.width_ratio;
                const vertexY = this.vertices[i][1] * this.height_ratio + this.global_translation[1] + this.local_translation[1] * this.height_ratio;
                const gradientFactor = i / (this.vertices.length - 1);
                const interpolatedColor = this.color.map((c, index) => c * (1.0 - gradientFactor) + coloredBorder[index] * gradientFactor);
                positions.push(vertexX, vertexY, 0);
                colors.push(interpolatedColor[0], interpolatedColor[1], interpolatedColor[2]);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }
        else {
            const positions = [];
            const colors = [];
            for (const vertex of this.vertices) {
                const vertexX = vertex[0] * this.width_ratio + this.global_translation[0] + this.local_translation[0] * this.width_ratio;
                const vertexY = vertex[1] * this.height_ratio + this.global_translation[1] + this.local_translation[1] * this.height_ratio;
                positions.push(vertexX, vertexY, 0);
                colors.push(this.color[0], this.color[1], this.color[2]);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    }
}
