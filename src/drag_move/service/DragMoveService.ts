import * as THREE from 'three';

export interface DragMoveService {
    onMouseMove(event: MouseEvent): void;
}