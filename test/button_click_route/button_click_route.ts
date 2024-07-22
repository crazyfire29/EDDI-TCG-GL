import {RouteMap} from "../../src/router/RouteMap";
import {routes} from "../../src/router/routes";


const appElement = document.getElementById('app');

if (appElement) {
    const routeMap = new RouteMap(appElement);
    routeMap.registerRoutes(routes);

    // 네비게이션을 위한 버튼 추가
    const lobbyButton = document.getElementById('lobby-btn');
    if (lobbyButton) {
        lobbyButton.addEventListener('click', () => {
            routeMap.navigate('/tcg-main-lobby');
        });
    }
}
