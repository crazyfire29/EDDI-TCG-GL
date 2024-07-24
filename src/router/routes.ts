import { TCGMainLobbyView } from '../lobby/TCGMainLobbyView';

export interface Route {
    path: string;
    component: any;
}

export const routes: Route[] = [
    { path: '/tcg-main-lobby', component: TCGMainLobbyView },
];