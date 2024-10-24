import * as THREE from "three";

export class BattleFieldHandSceneRepository {
    private static instance: BattleFieldHandSceneRepository;

    private currentFieldHandSceneList: THREE.Group[] = []

    private handAddedCallback: ((hand: THREE.Group) => void) | null = null;

    private constructor() { }

    public static getInstance(): BattleFieldHandSceneRepository {
        if (!BattleFieldHandSceneRepository.instance) {
            BattleFieldHandSceneRepository.instance = new BattleFieldHandSceneRepository();
        }

        return BattleFieldHandSceneRepository.instance
    }

    public addBattleFieldHandScene(hand: THREE.Group): void {
        this.currentFieldHandSceneList.push(hand)
        if (this.handAddedCallback) {
            this.handAddedCallback(hand);
        }
    }

    public getBattleFieldHandSceneList(): THREE.Group[] {
        return this.currentFieldHandSceneList
    }

    public setHandAddedCallback(callback: (hand: THREE.Group) => void): void {
        this.handAddedCallback = callback;
    }

    public resizeHandSceneList(scaleX: number, scaleY: number): void {
        console.log('resizeHandSceneList()')
        // this.currentFieldHandSceneList.forEach(child => {
        //     console.log('HandScene scaleX:', scaleX)
        //     console.log('HandScene scaleY:', scaleY)
        //     child.scale.set(scaleX, scaleY, 1);
        //
        //     // console.log('Window width:', window.screen.width)
        //
        //     // 각 축에 대해 개별적으로 위치도 조정
        //     // cardEnd = 0.972107
        //     // cardHeightLineCenter = cardEnd - scaleY * cardHeight
        //     // cardHeightPosition = 0.5 - cardHeightLineCenter
        //     // const scaledY = 0.5 - (0.972107 - 0.06493506493 * 1.615 * scaleY);
        //     // console.log('scaled Y:', scaledY * window.innerHeight);
        //
        //     const originalPosition = child.position.clone();
        //     console.log('child.position:', originalPosition)
        //
        //     child.position.set(
        //         // 0.06493506493 * scaleX - 0.5,
        //         child.position.x,
        //         // child.position.y,
        //         // 0.5 * scaleY - (0.972107 - 0.06493506493 * 1.615 * scaleY),
        //         child.position.y,
        //         child.position.z // Z축은 그대로 유지
        //     );
        // });

        // this.currentFieldHandSceneList.forEach(child => {
        //     child.scale.set(scaleX, scaleY, 1);
        // });

        this.currentFieldHandSceneList.forEach(group => {
            console.log('HandScene scaleX:', scaleX);
            console.log('HandScene scaleY:', scaleY);

            // 스케일 변경
            group.scale.set(scaleX, scaleY, 1);

            // group 내 자식 mesh들의 위치 조정
            group.children.forEach(child => {
                // 기존 위치 저장
                const originalPosition = child.position.clone();
                // console.log('Original position:', originalPosition);

                // 위치 조정
                // child.position.set(
                //     originalPosition.x * scaleFactorX,
                //     originalPosition.y * scaleFactorY,
                //     originalPosition.z // Z축은 그대로 유지
                // );

                child.position.set(
                    originalPosition.x,
                    // -0.563013 * window.innerHeight,
                    originalPosition.y,
                    originalPosition.z // Z축은 그대로 유지
                );

                // console.log('Updated position:', child.position);
            });
        });
    }
}