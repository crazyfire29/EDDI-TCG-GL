import { Route } from './routes';

export class RouteMap {
    private static instance: RouteMap;

    private routes: Route[] = [];
    private rootElement: HTMLElement;
    private currentComponent: any = null;

    constructor(rootElement: HTMLElement, initialPath: string = '/tcg-main-lobby') {
        this.rootElement = rootElement;
        window.addEventListener('popstate', this.handleRouteChange.bind(this));
        this.navigate(initialPath);
    }

    public static getInstance(rootElement: HTMLElement): RouteMap {
        if (!RouteMap.instance) {
            RouteMap.instance = new RouteMap(rootElement);
        }
        return RouteMap.instance;
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

        console.log('handleRouteChange() -> route:', route)

        if (route) {
            if (this.currentComponent && typeof this.currentComponent.dispose === 'function') {
                this.currentComponent.dispose();
            }
            // const component = new route.component();
            // this.rootElement.innerHTML = component.render();

            // this.rootElement.innerHTML = '';
            // const component = new route.component(this.rootElement);
            // component.initialize();

            // this.rootElement.innerHTML = '';
            // const component = route.getComponentInstance(this.rootElement, this);
            // component.initialize();

            this.rootElement.innerHTML = '';
            this.currentComponent = route.getComponentInstance(this.rootElement, this);
            this.currentComponent.initialize();
        } else {
            this.rootElement.innerHTML = '<h1>404 - Page not found</h1>';
        }
    }
}
