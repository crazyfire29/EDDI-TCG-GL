export interface ActivePanelAreaRepository {
    create(x: number, y: number): void;
    delete(): void;
    exists(): boolean;
}
