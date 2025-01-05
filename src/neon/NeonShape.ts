import * as THREE from 'three';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { MaskPass } from "three/examples/jsm/postprocessing/MaskPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {LineGeometry} from "three/examples/jsm/lines/LineGeometry";
import {Line2} from "three/examples/jsm/lines/Line2";
import {LineBasicMaterial} from "three";

interface CustomMeshBasicMaterialParameters extends THREE.MeshBasicMaterialParameters {
    onBeforeCompile?: (shader: THREE.ShaderMaterial) => void;
}

// Custom shader material interface
interface Shader extends THREE.ShaderMaterial {
    uniforms: any;
    fragmentShader: string;
}

export class NeonShape {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.OrthographicCamera;

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera) {
        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
    }

    // 통합된 createNeonLine
    private createNeonLine(startX: number, startY: number, endX: number, endY: number): THREE.Mesh {
        const color = 0x3137FD; // 네온 블루 색상
        const lineWidth = 10; // 선 두께

        const direction = new THREE.Vector3(endX - startX, endY - startY, 0);
        const length = direction.length();
        direction.normalize();

        const material = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });

        const geometry = new THREE.PlaneGeometry(length, lineWidth);
        const line = new THREE.Mesh(geometry, material);

        const angle = Math.atan2(direction.y, direction.x);
        line.rotation.z = angle;
        line.position.set(startX + direction.x * length / 2, startY + direction.y * length / 2, 4);

        return line;
    }

    // 블룸 효과 적용
    private applyGlowEffect(): EffectComposer {
        const composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.renderer.domElement.width, this.renderer.domElement.height),
            1.5, 0.4, 0.85
        );
        composer.addPass(bloomPass);

        return composer;
    }

    // 네온 라인 추가
    public async addNeonLine(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        const line = this.createNeonLine(startX, startY, endX, endY);
        this.scene.add(line);
        this.applyGlowEffect();
    }

    private createNeonRectangleWireframe(width: number, height: number, lineWidth: number = 5): THREE.LineSegments {
        const color = 0x3137FD;  // Neon blue color
        const borderColor = 0xFF0000;  // Red color for the border

        // Create the geometry for the wireframe: a simple rectangular path
        const vertices = new Float32Array([
            0, 0, 0,
            width, 0, 0,
            width, 0, 0,
            width, height, 0,
            width, height, 0,
            0, height, 0,
            0, height, 0,
            0, 0, 0
        ]);

        // Create a LineGeometry from the vertices
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        // Create a LineBasicMaterial for the wireframe with neon color
        const material = new LineBasicMaterial({
            color: borderColor,
            linewidth: lineWidth,
            opacity: 1,
            transparent: true,
            depthTest: false, // Ensure it stays visible
        });

        // Create the wireframe using the geometry and material
        const line = new THREE.LineSegments(geometry, material);
        return line;
    }

    // Method to add the neon rectangle wireframe to the scene
    public addNeonRectangle2(startX: number, startY: number, width: number, height: number, lineWidth: number = 5): void {
        const wireframe = this.createNeonRectangleWireframe(width, height, lineWidth);

        // Position the wireframe and add it to the scene
        wireframe.position.set(startX, startY, 0);
        this.scene.add(wireframe);

        const composer = this.applyGlowEffect();
        // const render = () => {
        //     composer.render();
        //     requestAnimationFrame(render);
        // };
        // render();
    }

    // 네온 사각형 추가
    public async addNeonRectangle1(startX: number, startY: number, rectLength: number): Promise<void> {
        await this.addNeonLine(startX + 5.0, startY, startX + rectLength - 5.0, startY); // 하단
        await this.addNeonLine(startX + rectLength, startY - 5.0, startX + rectLength, startY + rectLength); // 우측
        await this.addNeonLine(startX + rectLength + 5.0, startY + rectLength + 5.0, startX - 5.0, startY + rectLength + 5.0); // 상단
        await this.addNeonLine(startX, startY + rectLength, startX, startY - 5.0); // 좌측
    }
}
