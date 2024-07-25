import {RouteMap} from "../../src/router/RouteMap";
import {routes} from "../../src/router/routes";
import {TCGMainLobbyView} from "../../src/lobby/TCGMainLobbyView";

const rootElement = document.getElementById('app');

// if (rootElement) {
//     const routeMap = new RouteMap(rootElement);
//     routeMap.registerRoutes(routes);
//     routeMap.navigate('/tcg-main-lobby');
//     //
//     // const mainLobbyView = TCGMainLobbyView.getInstance(rootElement, routeMap);
//     // mainLobbyView.initialize();
// } else {
//     console.error('Root element not found');
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const rootElement = document.getElementById('app');
//     if (rootElement) {
//         const routeMap = new RouteMap(rootElement, '/tcg-main-lobby');
//         routeMap.registerRoutes(routes);
//     }
// });

if (rootElement) {
    const routeMap = new RouteMap(rootElement, '/tcg-main-lobby');
    routeMap.registerRoutes(routes);
} else {
    console.error('Root element not found');
}