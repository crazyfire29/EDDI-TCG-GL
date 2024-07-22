import { Route } from './routes';

export class RouteMap {
    private routes: Route[] = [];
    private rootElement: HTMLElement;

    constructor(rootElement: HTMLElement) {
        this.rootElement = rootElement;
        window.addEventListener('popstate', this.handleRouteChange.bind(this));
    }

    public registerRoutes(routes: Route[]): void {
        this.routes = routes;
        this.handleRouteChange();
    }

    public navigate(path: string): void {
        window.history.pushState({}, '', path);
        this.handleRouteChange();
    }

    private handleRouteChange(): void {
        const currentPath = window.location.pathname;
        const route = this.routes.find(route => route.path === currentPath);

        if (route) {
            const component = new route.component();
            this.rootElement.innerHTML = component.render();
        } else {
            this.rootElement.innerHTML = '<h1>404 - Page not found</h1>';
        }
    }
}
