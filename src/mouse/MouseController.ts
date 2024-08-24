import * as THREE from 'three';

export class MouseController {
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private buttonClickHandlers: { [uuid: string]: () => void } = {};

    constructor(camera: THREE.Camera, scene: THREE.Scene) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = camera;
        this.scene = scene;
        window.addEventListener('click', this.onMouseClick.bind(this));
    }

    private onMouseClick(event: MouseEvent): void {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        console.log(`Mouse clicked at: (${event.clientX}, ${event.clientY})`);
        console.log('this.scene.children:', this.scene.children);

        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Raycaster가 현재 등록된 버튼들만 검사하도록 설정
        const buttons = Object.keys(this.buttonClickHandlers).map(uuid => this.scene.getObjectByProperty('uuid', uuid)).filter(obj => obj instanceof THREE.Mesh);
        const intersects = this.raycaster.intersectObjects(buttons as THREE.Object3D[], true);

        // const buttons = this.scene.children.filter(obj => this.buttonClickHandlers[obj.uuid] !== undefined);
        // const intersects = this.raycaster.intersectObjects(buttons, true);

        console.log('every button handler list:', this.buttonClickHandlers);

        if (intersects.length > 0) {
            const intersectedButton = intersects[0].object as THREE.Mesh;
            console.log('Intersected button:', intersectedButton);
            const handler = this.buttonClickHandlers[intersectedButton.uuid];
            console.log('Handler:', handler);
            if (handler) {
                console.log('Handler found for button with UUID:', intersectedButton.uuid);
                handler();
            } else {
                console.warn(`No handler found for button with UUID: ${intersectedButton.uuid}`);
            }
        } else {
            console.log('No buttons intersected by the raycaster.');
        }
    }

    public getRegisteredButtons(): string[] {
        return Object.keys(this.buttonClickHandlers);
    }

    // 등록 및 제거 메서드들에 로그를 추가하여 정확히 동작하는지 확인
    public registerButton(button: THREE.Mesh, handler: () => void): void {
        if (!this.buttonClickHandlers[button.uuid]) {  // 중복 확인
            this.buttonClickHandlers[button.uuid] = handler;
            console.log(`Registered button: ${button.uuid}`);
        } else {
            console.log(`Button with UUID ${button.uuid} is already registered.`);
        }
        console.log('Current registered buttons:', this.getRegisteredButtons());
    }

    public unregisterButton(button: THREE.Mesh): void {
        if (this.buttonClickHandlers[button.uuid]) {
            delete this.buttonClickHandlers[button.uuid];
            console.log(`Unregistered button: ${button.uuid}`);
        } else {
            console.log(`Button with UUID ${button.uuid} is not registered.`);
        }
        console.log('Current registered buttons after unregister:', this.getRegisteredButtons());
    }

    public clearButtons(): void {
        this.buttonClickHandlers = {};
        console.log('All button handlers cleared.');
    }
}
