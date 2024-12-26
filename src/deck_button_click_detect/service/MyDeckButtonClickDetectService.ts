import {MyDeckButtonScene} from "../../my_deck_button_scene/entity/MyDeckButtonScene";

// export interface MyDeckButtonClickDetectService {
//     setLeftMouseDown(state: boolean): void
//     isLeftMouseDown(): boolean
//     handleLeftClick(
//         clickPoint: { x: number; y: number },
//     ): any | null;
// }

export interface MyDeckButtonClickDetectService {
    handleLeftClick(
        event: MouseEvent,
        onClick: (clickedDeckButton: MyDeckButtonScene) => void
    ): Promise<MyDeckButtonScene | null>;
}