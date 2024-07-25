import { TCGMainLobbyView } from '../lobby/TCGMainLobbyView';
import {RouteMap} from "./RouteMap";
import {Component} from "./Component";

// export interface Route {
//     path: string;
//     component: any;
// }

// export const routes: Route[] = [
//     { path: '/tcg-main-lobby', component: TCGMainLobbyView },
// ];

export interface Route {
    path: string;
    getComponentInstance: (rootElement: HTMLElement, routeMap: RouteMap) => Component;
}

export const routes: Route[] = [
    {
        path: '/tcg-main-lobby',
        getComponentInstance: (rootElement: HTMLElement, routeMap: RouteMap) => {
            return TCGMainLobbyView.getInstance(rootElement, routeMap);
        }
    },
];