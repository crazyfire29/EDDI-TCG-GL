import { TCGMainLobbyView } from '../lobby/TCGMainLobbyView';
import {RouteMap} from "./RouteMap";
import {Component} from "./Component";
import {TCGCardShopView} from "../shop/TCGCardShopView";

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
    {
        path: '/tcg-card-shop',
        getComponentInstance: (rootElement: HTMLElement, routeMap: RouteMap) => {
            return TCGCardShopView.getInstance(rootElement, routeMap);
        }
    },
];