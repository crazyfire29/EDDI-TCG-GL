import * as THREE from "three";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";
import {SelectedCardBlockPosition} from "../../selected_card_block_position/entity/SelectedCardBlockPosition";

export interface SideScrollService {
    onWheelScroll(event: WheelEvent): Promise<void>;
    setClippingPlanes(sideScrollArea: SideScrollArea): THREE.Plane[];
    getBlockCount(): number;
}
