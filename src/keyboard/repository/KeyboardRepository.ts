export interface KeyboardRepository {
    getHandler(key: string): (() => void) | undefined;
}
