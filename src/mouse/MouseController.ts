import * as THREE from 'three';

export class MouseController {
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private camera: THREE.OrthographicCamera;
    private scene: THREE.Scene;

    private buttons: THREE.Mesh[] = [];
    private buttonClickHandlers: { [key: string]: () => void } = {};

    constructor(camera: THREE.OrthographicCamera, scene: THREE.Scene) {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.camera = camera;
        this.scene = scene;

        this.buttonClickHandlers = {};

        window.addEventListener('click', this.onMouseClick.bind(this));
    }

    public registerButton(button: THREE.Mesh, handler: () => void): void {
        console.log('registerButton -> button:', button, ', handler: ', handler)
        this.buttonClickHandlers[button.uuid] = handler;
        console.log('registerButton -> buttonClickHandlers:', this.buttonClickHandlers)
        console.log('registerButton -> buttonClickHandlers[button.uuid]:', this.buttonClickHandlers[button.uuid])
    }

    // private onMouseClick(event: MouseEvent): void {
    //     // 마우스 좌표를 정규화된 장치 좌표로 변환
    //     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //
    //     // Raycaster 설정
    //     this.raycaster.setFromCamera(this.mouse, this.camera);
    //
    //     // 모든 클릭 가능한 객체와의 교차 검사
    //     const intersects = this.raycaster.intersectObjects(this.scene.children);
    //
    //     if (intersects.length > 0) {
    //         const intersectedObject = intersects[0].object;
    //         console.log('클릭된 객체:', intersectedObject);
    //         // 클릭된 객체에 대한 로직 처리
    //     } else {
    //         // 클릭된 위치의 좌표를 출력
    //         const mousePosition = new THREE.Vector3(this.mouse.x, this.mouse.y, 0);
    //         console.log('클릭된 위치의 좌표:', mousePosition);
    //     }
    // }

    private onMouseClick(event: MouseEvent): void {
        // 마우스 좌표를 정규화된 장치 좌표로 변환
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        console.log(`Mouse clicked at: (${event.clientX}, ${event.clientY})`);

        // Raycaster 설정
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // 클릭된 버튼과의 교차 검사
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        console.log('this.scene.children:', this.scene.children);

        if (intersects.length > 0) {
            const intersectedButton = intersects[0].object as THREE.Mesh;
            console.log('Intersected button:', intersectedButton);

            const handler = this.buttonClickHandlers[intersectedButton.uuid];
            console.log('handler:', handler);

            if (handler) {
                console.log('Handler found for button with UUID:', intersectedButton.uuid);
                handler();
            } else {
                console.warn(`No handler found for button with UUID: ${intersectedButton.uuid}`);
            }
        }
    }
}
