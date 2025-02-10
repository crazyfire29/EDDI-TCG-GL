import * as THREE from "three";
import {SideScrollArea} from "../../side_scroll_area/entity/SideScrollArea";

export interface SideScrollRepository {
    setClippingPlanes(sideScrollArea: SideScrollArea): void
}