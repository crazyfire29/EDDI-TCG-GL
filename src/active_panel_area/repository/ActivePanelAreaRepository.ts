import {Card} from "../../card/types";

export interface ActivePanelAreaRepository {
    create(x: number, y: number, cardId: number): void;
    delete(): void;
    exists(): boolean;
}
