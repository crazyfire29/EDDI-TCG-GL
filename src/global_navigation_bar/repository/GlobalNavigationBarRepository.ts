import * as THREE from 'three';
import {GlobalNavigationBar} from "../entity/GlobalNavigationBar";
import {Vector2d} from "../../common/math/Vector2d";

export interface GlobalNavigationBarRepository {
    createGlobalNavigationBar(type: number, position: Vector2d): Promise<GlobalNavigationBar>;
    findButtonById(buttonId: number): GlobalNavigationBar | null;
    findAllButton(): GlobalNavigationBar[];
    findAllButtonIdList(): number[];
    deleteAllButton(): void;
}