import * as THREE from "three";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";

export interface SideScrollService {
    onWheelScroll(event: WheelEvent): Promise<void>;
    getScrollEnabled(): boolean;
    setClippingPlanes(sideScrollArea: SideScrollArea): THREE.Plane[];
    getSideScrollArea(): SideScrollArea | null;
}
