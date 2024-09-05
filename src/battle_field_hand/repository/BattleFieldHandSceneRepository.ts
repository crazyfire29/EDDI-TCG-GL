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
}