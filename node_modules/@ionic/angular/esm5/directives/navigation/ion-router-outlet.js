import * as tslib_1 from "tslib";
import { Location } from '@angular/common';
import { Attribute, ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EventEmitter, Injector, NgZone, OnDestroy, OnInit, Optional, Output, SkipSelf, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ChildrenOutletContexts, OutletContext, PRIMARY_OUTLET, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { Config } from '../../providers/config';
import { NavController } from '../../providers/nav-controller';
import { StackController } from './stack-controller';
import { getUrl } from './stack-utils';
var IonRouterOutlet = /** @class */ (function () {
    function IonRouterOutlet(parentContexts, location, resolver, name, tabs, config, navCtrl, commonLocation, elementRef, router, zone, activatedRoute, parentOutlet) {
        this.parentContexts = parentContexts;
        this.location = location;
        this.resolver = resolver;
        this.config = config;
        this.navCtrl = navCtrl;
        this.parentOutlet = parentOutlet;
        this.activated = null;
        this.activatedView = null;
        this._activatedRoute = null;
        // Maintain map of activated route proxies for each component instance
        this.proxyMap = new WeakMap();
        // Keep the latest activated route in a subject for the proxy routes to switch map to
        this.currentActivatedRoute$ = new BehaviorSubject(null);
        this.stackEvents = new EventEmitter();
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
        this.nativeEl = elementRef.nativeElement;
        this.name = name || PRIMARY_OUTLET;
        this.tabsPrefix = tabs === 'true' ? getUrl(router, activatedRoute) : undefined;
        this.stackCtrl = new StackController(this.tabsPrefix, this.nativeEl, router, navCtrl, zone, commonLocation);
        parentContexts.onChildOutletCreated(this.name, this);
    }
    Object.defineProperty(IonRouterOutlet.prototype, "animation", {
        set: function (animation) {
            this.nativeEl.animation = animation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "animated", {
        set: function (animated) {
            this.nativeEl.animated = animated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "swipeGesture", {
        set: function (swipe) {
            var _this = this;
            this._swipeGesture = swipe;
            this.nativeEl.swipeHandler = swipe ? {
                canStart: function () { return _this.stackCtrl.canGoBack(1); },
                onStart: function () { return _this.stackCtrl.startBackTransition(); },
                onEnd: function (shouldContinue) { return _this.stackCtrl.endBackTransition(shouldContinue); }
            } : undefined;
        },
        enumerable: true,
        configurable: true
    });
    IonRouterOutlet.prototype.ngOnDestroy = function () {
        this.stackCtrl.destroy();
    };
    IonRouterOutlet.prototype.getContext = function () {
        return this.parentContexts.getContext(this.name);
    };
    IonRouterOutlet.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.activated) {
            // If the outlet was not instantiated at the time the route got activated we need to populate
            // the outlet when it is initialized (ie inside a NgIf)
            var context = this.getContext();
            if (context && context.route) {
                this.activateWith(context.route, context.resolver || null);
            }
        }
        if (this.nativeEl.componentOnReady) {
            this.nativeEl.componentOnReady().then(function () {
                if (_this._swipeGesture === undefined) {
                    _this.swipeGesture = _this.config.getBoolean('swipeBackEnabled', _this.nativeEl.mode === 'ios');
                }
            });
        }
    };
    Object.defineProperty(IonRouterOutlet.prototype, "isActivated", {
        get: function () {
            return !!this.activated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "component", {
        get: function () {
            if (!this.activated) {
                throw new Error('Outlet is not activated');
            }
            return this.activated.instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "activatedRoute", {
        get: function () {
            if (!this.activated) {
                throw new Error('Outlet is not activated');
            }
            return this._activatedRoute;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IonRouterOutlet.prototype, "activatedRouteData", {
        get: function () {
            if (this._activatedRoute) {
                return this._activatedRoute.snapshot.data;
            }
            return {};
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Called when the `RouteReuseStrategy` instructs to detach the subtree
     */
    IonRouterOutlet.prototype.detach = function () {
        throw new Error('incompatible reuse strategy');
    };
    /**
     * Called when the `RouteReuseStrategy` instructs to re-attach a previously detached subtree
     */
    IonRouterOutlet.prototype.attach = function (_ref, _activatedRoute) {
        throw new Error('incompatible reuse strategy');
    };
    IonRouterOutlet.prototype.deactivate = function () {
        if (this.activated) {
            if (this.activatedView) {
                this.activatedView.savedData = new Map(this.getContext().children['contexts']);
                /**
                 * Ensure we are saving the NavigationExtras
                 * data otherwise it will be lost
                 */
                this.activatedView.savedExtras = {};
                var context = this.getContext();
                if (context.route) {
                    var contextSnapshot = context.route.snapshot;
                    this.activatedView.savedExtras.queryParams = contextSnapshot.queryParams;
                    this.activatedView.savedExtras.fragment = contextSnapshot.fragment;
                }
            }
            var c = this.component;
            this.activatedView = null;
            this.activated = null;
            this._activatedRoute = null;
            this.deactivateEvents.emit(c);
        }
    };
    IonRouterOutlet.prototype.activateWith = function (activatedRoute, resolver) {
        var _this = this;
        if (this.isActivated) {
            throw new Error('Cannot activate an already activated outlet');
        }
        this._activatedRoute = activatedRoute;
        var cmpRef;
        var enteringView = this.stackCtrl.getExistingView(activatedRoute);
        if (enteringView) {
            cmpRef = this.activated = enteringView.ref;
            var saved = enteringView.savedData;
            if (saved) {
                // self-restore
                var context = this.getContext();
                context.children['contexts'] = saved;
            }
            // Updated activated route proxy for this component
            this.updateActivatedRouteProxy(cmpRef.instance, activatedRoute);
        }
        else {
            var snapshot = activatedRoute._futureSnapshot;
            var component = snapshot.routeConfig.component;
            resolver = resolver || this.resolver;
            var factory = resolver.resolveComponentFactory(component);
            var childContexts = this.parentContexts.getOrCreateContext(this.name).children;
            // We create an activated route proxy object that will maintain future updates for this component
            // over its lifecycle in the stack.
            var component$ = new BehaviorSubject(null);
            var activatedRouteProxy = this.createActivatedRouteProxy(component$, activatedRoute);
            var injector = new OutletInjector(activatedRouteProxy, childContexts, this.location.injector);
            cmpRef = this.activated = this.location.createComponent(factory, this.location.length, injector);
            // Once the component is created we can push it to our local subject supplied to the proxy
            component$.next(cmpRef.instance);
            // Calling `markForCheck` to make sure we will run the change detection when the
            // `RouterOutlet` is inside a `ChangeDetectionStrategy.OnPush` component.
            enteringView = this.stackCtrl.createView(this.activated, activatedRoute);
            // Store references to the proxy by component
            this.proxyMap.set(cmpRef.instance, activatedRouteProxy);
            this.currentActivatedRoute$.next({ component: cmpRef.instance, activatedRoute: activatedRoute });
        }
        this.activatedView = enteringView;
        this.stackCtrl.setActive(enteringView).then(function (data) {
            _this.navCtrl.setTopOutlet(_this);
            _this.activateEvents.emit(cmpRef.instance);
            _this.stackEvents.emit(data);
        });
    };
    /**
     * Returns `true` if there are pages in the stack to go back.
     */
    IonRouterOutlet.prototype.canGoBack = function (deep, stackId) {
        if (deep === void 0) { deep = 1; }
        return this.stackCtrl.canGoBack(deep, stackId);
    };
    /**
     * Resolves to `true` if it the outlet was able to sucessfully pop the last N pages.
     */
    IonRouterOutlet.prototype.pop = function (deep, stackId) {
        if (deep === void 0) { deep = 1; }
        return this.stackCtrl.pop(deep, stackId);
    };
    /**
     * Returns the URL of the active page of each stack.
     */
    IonRouterOutlet.prototype.getLastUrl = function (stackId) {
        var active = this.stackCtrl.getLastUrl(stackId);
        return active ? active.url : undefined;
    };
    /**
     * Returns the RouteView of the active page of each stack.
     * @internal
     */
    IonRouterOutlet.prototype.getLastRouteView = function (stackId) {
        return this.stackCtrl.getLastUrl(stackId);
    };
    /**
     * Returns the root view in the tab stack.
     * @internal
     */
    IonRouterOutlet.prototype.getRootView = function (stackId) {
        return this.stackCtrl.getRootUrl(stackId);
    };
    /**
     * Returns the active stack ID. In the context of ion-tabs, it means the active tab.
     */
    IonRouterOutlet.prototype.getActiveStackId = function () {
        return this.stackCtrl.getActiveStackId();
    };
    /**
     * Since the activated route can change over the life time of a component in an ion router outlet, we create
     * a proxy so that we can update the values over time as a user navigates back to components already in the stack.
     */
    IonRouterOutlet.prototype.createActivatedRouteProxy = function (component$, activatedRoute) {
        var proxy = new ActivatedRoute();
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        // Setup wrappers for the observables so consumers don't have to worry about switching to new observables as the state updates
        proxy._paramMap = this.proxyObservable(component$, 'paramMap');
        proxy._queryParamMap = this.proxyObservable(component$, 'queryParamMap');
        proxy.url = this.proxyObservable(component$, 'url');
        proxy.params = this.proxyObservable(component$, 'params');
        proxy.queryParams = this.proxyObservable(component$, 'queryParams');
        proxy.fragment = this.proxyObservable(component$, 'fragment');
        proxy.data = this.proxyObservable(component$, 'data');
        return proxy;
    };
    /**
     * Create a wrapped observable that will switch to the latest activated route matched by the given component
     */
    IonRouterOutlet.prototype.proxyObservable = function (component$, path) {
        var _this = this;
        return component$.pipe(
        // First wait until the component instance is pushed
        filter(function (component) { return !!component; }), switchMap(function (component) {
            return _this.currentActivatedRoute$.pipe(filter(function (current) { return current !== null && current.component === component; }), switchMap(function (current) { return current && current.activatedRoute[path]; }), distinctUntilChanged());
        }));
    };
    /**
     * Updates the activated route proxy for the given component to the new incoming router state
     */
    IonRouterOutlet.prototype.updateActivatedRouteProxy = function (component, activatedRoute) {
        var proxy = this.proxyMap.get(component);
        if (!proxy) {
            throw new Error("Could not find activated route proxy for view");
        }
        proxy._futureSnapshot = activatedRoute._futureSnapshot;
        proxy._routerState = activatedRoute._routerState;
        proxy.snapshot = activatedRoute.snapshot;
        proxy.outlet = activatedRoute.outlet;
        proxy.component = activatedRoute.component;
        this.currentActivatedRoute$.next({ component: component, activatedRoute: activatedRoute });
    };
    IonRouterOutlet.ctorParameters = function () { return [
        { type: ChildrenOutletContexts },
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver },
        { type: String, decorators: [{ type: Attribute, args: ['name',] }] },
        { type: String, decorators: [{ type: Optional }, { type: Attribute, args: ['tabs',] }] },
        { type: Config },
        { type: NavController },
        { type: Location },
        { type: ElementRef },
        { type: Router },
        { type: NgZone },
        { type: ActivatedRoute },
        { type: IonRouterOutlet, decorators: [{ type: SkipSelf }, { type: Optional }] }
    ]; };
    tslib_1.__decorate([
        Output()
    ], IonRouterOutlet.prototype, "stackEvents", void 0);
    tslib_1.__decorate([
        Output('activate')
    ], IonRouterOutlet.prototype, "activateEvents", void 0);
    tslib_1.__decorate([
        Output('deactivate')
    ], IonRouterOutlet.prototype, "deactivateEvents", void 0);
    IonRouterOutlet = tslib_1.__decorate([
        Directive({
            selector: 'ion-router-outlet',
            exportAs: 'outlet',
            inputs: ['animated', 'animation', 'swipeGesture']
        }),
        tslib_1.__param(3, Attribute('name')),
        tslib_1.__param(4, Optional()), tslib_1.__param(4, Attribute('tabs')),
        tslib_1.__param(12, SkipSelf()), tslib_1.__param(12, Optional())
    ], IonRouterOutlet);
    return IonRouterOutlet;
}());
export { IonRouterOutlet };
var OutletInjector = /** @class */ (function () {
    function OutletInjector(route, childContexts, parent) {
        this.route = route;
        this.childContexts = childContexts;
        this.parent = parent;
    }
    OutletInjector.prototype.get = function (token, notFoundValue) {
        if (token === ActivatedRoute) {
            return this.route;
        }
        if (token === ChildrenOutletContexts) {
            return this.childContexts;
        }
        // tslint:disable-next-line
        return this.parent.get(token, notFoundValue);
    };
    return OutletInjector;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9uLXJvdXRlci1vdXRsZXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AaW9uaWMvYW5ndWxhci8iLCJzb3VyY2VzIjpbImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi9pb24tcm91dGVyLW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxTSxPQUFPLEVBQUUsY0FBYyxFQUFFLHNCQUFzQixFQUFFLGFBQWEsRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEgsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUNuRCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3pFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFL0QsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBYSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPbEQ7SUF5Q0UseUJBQ1UsY0FBc0MsRUFDdEMsUUFBMEIsRUFDMUIsUUFBa0MsRUFDdkIsSUFBWSxFQUNBLElBQVksRUFDbkMsTUFBYyxFQUNkLE9BQXNCLEVBQzlCLGNBQXdCLEVBQ3hCLFVBQXNCLEVBQ3RCLE1BQWMsRUFDZCxJQUFZLEVBQ1osY0FBOEIsRUFDRyxZQUE4QjtRQVp2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Q3JDLFdBQU0sR0FBTixNQUFNLENBQVU7SUFDdEIsQ0FBQztJQUVMLDRCQUFHLEdBQUgsVUFBSSxLQUFVLEVBQUUsYUFBbUI7UUFDakMsSUFBSSxLQUFLLEtBQUssY0FBYyxFQUFFO1lBQzVCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQjtRQUVELElBQUksS0FBSyxLQUFLLHNCQUFzQixFQUFFO1lBQ3BDLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQztTQUMzQjtRQUVELDJCQUEyQjtRQUMzQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBbkJELElBbUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQXR0cmlidXRlLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIENvbXBvbmVudFJlZiwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdG9yLCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBPcHRpb25hbCwgT3V0cHV0LCBTa2lwU2VsZiwgVmlld0NvbnRhaW5lclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUsIENoaWxkcmVuT3V0bGV0Q29udGV4dHMsIE91dGxldENvbnRleHQsIFBSSU1BUllfT1VUTEVULCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlsdGVyLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IEFuaW1hdGlvbkJ1aWxkZXIgfSBmcm9tICcuLi8uLi8nO1xuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL2NvbmZpZyc7XG5pbXBvcnQgeyBOYXZDb250cm9sbGVyIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL25hdi1jb250cm9sbGVyJztcblxuaW1wb3J0IHsgU3RhY2tDb250cm9sbGVyIH0gZnJvbSAnLi9zdGFjay1jb250cm9sbGVyJztcbmltcG9ydCB7IFJvdXRlVmlldywgZ2V0VXJsIH0gZnJvbSAnLi9zdGFjay11dGlscyc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lvbi1yb3V0ZXItb3V0bGV0JyxcbiAgZXhwb3J0QXM6ICdvdXRsZXQnLFxuICBpbnB1dHM6IFsnYW5pbWF0ZWQnLCAnYW5pbWF0aW9uJywgJ3N3aXBlR2VzdHVyZSddXG59KVxuZXhwb3J0IGNsYXNzIElvblJvdXRlck91dGxldCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgbmF0aXZlRWw6IEhUTUxJb25Sb3V0ZXJPdXRsZXRFbGVtZW50O1xuXG4gIHByaXZhdGUgYWN0aXZhdGVkOiBDb21wb25lbnRSZWY8YW55PiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGFjdGl2YXRlZFZpZXc6IFJvdXRlVmlldyB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgX2FjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9zd2lwZUdlc3R1cmU/OiBib29sZWFuO1xuICBwcml2YXRlIG5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBzdGFja0N0cmw6IFN0YWNrQ29udHJvbGxlcjtcblxuICAvLyBNYWludGFpbiBtYXAgb2YgYWN0aXZhdGVkIHJvdXRlIHByb3hpZXMgZm9yIGVhY2ggY29tcG9uZW50IGluc3RhbmNlXG4gIHByaXZhdGUgcHJveHlNYXAgPSBuZXcgV2Vha01hcDxhbnksIEFjdGl2YXRlZFJvdXRlPigpO1xuXG4gIC8vIEtlZXAgdGhlIGxhdGVzdCBhY3RpdmF0ZWQgcm91dGUgaW4gYSBzdWJqZWN0IGZvciB0aGUgcHJveHkgcm91dGVzIHRvIHN3aXRjaCBtYXAgdG9cbiAgcHJpdmF0ZSBjdXJyZW50QWN0aXZhdGVkUm91dGUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDx7IGNvbXBvbmVudDogYW55OyBhY3RpdmF0ZWRSb3V0ZTogQWN0aXZhdGVkUm91dGUgfSB8IG51bGw+KG51bGwpO1xuXG4gIHRhYnNQcmVmaXg6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICBAT3V0cHV0KCkgc3RhY2tFdmVudHMgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgnYWN0aXZhdGUnKSBhY3RpdmF0ZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCdkZWFjdGl2YXRlJykgZGVhY3RpdmF0ZUV2ZW50cyA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIHNldCBhbmltYXRpb24oYW5pbWF0aW9uOiBBbmltYXRpb25CdWlsZGVyKSB7XG4gICAgdGhpcy5uYXRpdmVFbC5hbmltYXRpb24gPSBhbmltYXRpb247XG4gIH1cblxuICBzZXQgYW5pbWF0ZWQoYW5pbWF0ZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLm5hdGl2ZUVsLmFuaW1hdGVkID0gYW5pbWF0ZWQ7XG4gIH1cblxuICBzZXQgc3dpcGVHZXN0dXJlKHN3aXBlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fc3dpcGVHZXN0dXJlID0gc3dpcGU7XG5cbiAgICB0aGlzLm5hdGl2ZUVsLnN3aXBlSGFuZGxlciA9IHN3aXBlID8ge1xuICAgICAgY2FuU3RhcnQ6ICgpID0+IHRoaXMuc3RhY2tDdHJsLmNhbkdvQmFjaygxKSxcbiAgICAgIG9uU3RhcnQ6ICgpID0+IHRoaXMuc3RhY2tDdHJsLnN0YXJ0QmFja1RyYW5zaXRpb24oKSxcbiAgICAgIG9uRW5kOiBzaG91bGRDb250aW51ZSA9PiB0aGlzLnN0YWNrQ3RybC5lbmRCYWNrVHJhbnNpdGlvbihzaG91bGRDb250aW51ZSlcbiAgICB9IDogdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBwYXJlbnRDb250ZXh0czogQ2hpbGRyZW5PdXRsZXRDb250ZXh0cyxcbiAgICBwcml2YXRlIGxvY2F0aW9uOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBAQXR0cmlidXRlKCduYW1lJykgbmFtZTogc3RyaW5nLFxuICAgIEBPcHRpb25hbCgpIEBBdHRyaWJ1dGUoJ3RhYnMnKSB0YWJzOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBjb25maWc6IENvbmZpZyxcbiAgICBwcml2YXRlIG5hdkN0cmw6IE5hdkNvbnRyb2xsZXIsXG4gICAgY29tbW9uTG9jYXRpb246IExvY2F0aW9uLFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcm91dGVyOiBSb3V0ZXIsXG4gICAgem9uZTogTmdab25lLFxuICAgIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBAU2tpcFNlbGYoKSBAT3B0aW9uYWwoKSByZWFkb25seSBwYXJlbnRPdXRsZXQ/OiBJb25Sb3V0ZXJPdXRsZXRcbiAgKSB7XG4gICAgdGhpcy5uYXRpdmVFbCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLm5hbWUgPSBuYW1lIHx8IFBSSU1BUllfT1VUTEVUO1xuICAgIHRoaXMudGFic1ByZWZpeCA9IHRhYnMgPT09ICd0cnVlJyA/IGdldFVybChyb3V0ZXIsIGFjdGl2YXRlZFJvdXRlKSA6IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN0YWNrQ3RybCA9IG5ldyBTdGFja0NvbnRyb2xsZXIodGhpcy50YWJzUHJlZml4LCB0aGlzLm5hdGl2ZUVsLCByb3V0ZXIsIG5hdkN0cmwsIHpvbmUsIGNvbW1vbkxvY2F0aW9uKTtcbiAgICBwYXJlbnRDb250ZXh0cy5vbkNoaWxkT3V0bGV0Q3JlYXRlZCh0aGlzLm5hbWUsIHRoaXMgYXMgYW55KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc3RhY2tDdHJsLmRlc3Ryb3koKTtcbiAgfVxuXG4gIGdldENvbnRleHQoKTogT3V0bGV0Q29udGV4dCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnBhcmVudENvbnRleHRzLmdldENvbnRleHQodGhpcy5uYW1lKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hY3RpdmF0ZWQpIHtcbiAgICAgIC8vIElmIHRoZSBvdXRsZXQgd2FzIG5vdCBpbnN0YW50aWF0ZWQgYXQgdGhlIHRpbWUgdGhlIHJvdXRlIGdvdCBhY3RpdmF0ZWQgd2UgbmVlZCB0byBwb3B1bGF0ZVxuICAgICAgLy8gdGhlIG91dGxldCB3aGVuIGl0IGlzIGluaXRpYWxpemVkIChpZSBpbnNpZGUgYSBOZ0lmKVxuICAgICAgY29uc3QgY29udGV4dCA9IHRoaXMuZ2V0Q29udGV4dCgpO1xuICAgICAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5yb3V0ZSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlV2l0aChjb250ZXh0LnJvdXRlLCBjb250ZXh0LnJlc29sdmVyIHx8IG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKHRoaXMubmF0aXZlRWwgYXMgYW55KS5jb21wb25lbnRPblJlYWR5KSB7XG4gICAgICB0aGlzLm5hdGl2ZUVsLmNvbXBvbmVudE9uUmVhZHkoKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuX3N3aXBlR2VzdHVyZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5zd2lwZUdlc3R1cmUgPSB0aGlzLmNvbmZpZy5nZXRCb29sZWFuKCdzd2lwZUJhY2tFbmFibGVkJywgKHRoaXMubmF0aXZlRWwgYXMgYW55KS5tb2RlID09PSAnaW9zJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCBpc0FjdGl2YXRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmFjdGl2YXRlZDtcbiAgfVxuXG4gIGdldCBjb21wb25lbnQoKTogb2JqZWN0IHtcbiAgICBpZiAoIXRoaXMuYWN0aXZhdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ091dGxldCBpcyBub3QgYWN0aXZhdGVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmFjdGl2YXRlZC5pbnN0YW5jZTtcbiAgfVxuXG4gIGdldCBhY3RpdmF0ZWRSb3V0ZSgpOiBBY3RpdmF0ZWRSb3V0ZSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2YXRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPdXRsZXQgaXMgbm90IGFjdGl2YXRlZCcpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVkUm91dGUgYXMgQWN0aXZhdGVkUm91dGU7XG4gIH1cblxuICBnZXQgYWN0aXZhdGVkUm91dGVEYXRhKCk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2FjdGl2YXRlZFJvdXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fYWN0aXZhdGVkUm91dGUuc25hcHNob3QuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgUm91dGVSZXVzZVN0cmF0ZWd5YCBpbnN0cnVjdHMgdG8gZGV0YWNoIHRoZSBzdWJ0cmVlXG4gICAqL1xuICBkZXRhY2goKTogQ29tcG9uZW50UmVmPGFueT4ge1xuICAgIHRocm93IG5ldyBFcnJvcignaW5jb21wYXRpYmxlIHJldXNlIHN0cmF0ZWd5Jyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBSb3V0ZVJldXNlU3RyYXRlZ3lgIGluc3RydWN0cyB0byByZS1hdHRhY2ggYSBwcmV2aW91c2x5IGRldGFjaGVkIHN1YnRyZWVcbiAgICovXG4gIGF0dGFjaChfcmVmOiBDb21wb25lbnRSZWY8YW55PiwgX2FjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW5jb21wYXRpYmxlIHJldXNlIHN0cmF0ZWd5Jyk7XG4gIH1cblxuICBkZWFjdGl2YXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFjdGl2YXRlZCkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZhdGVkVmlldykge1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFZpZXcuc2F2ZWREYXRhID0gbmV3IE1hcCh0aGlzLmdldENvbnRleHQoKSEuY2hpbGRyZW5bJ2NvbnRleHRzJ10pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBFbnN1cmUgd2UgYXJlIHNhdmluZyB0aGUgTmF2aWdhdGlvbkV4dHJhc1xuICAgICAgICAgKiBkYXRhIG90aGVyd2lzZSBpdCB3aWxsIGJlIGxvc3RcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYWN0aXZhdGVkVmlldy5zYXZlZEV4dHJhcyA9IHt9O1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5nZXRDb250ZXh0KCkhO1xuXG4gICAgICAgIGlmIChjb250ZXh0LnJvdXRlKSB7XG4gICAgICAgICAgY29uc3QgY29udGV4dFNuYXBzaG90ID0gY29udGV4dC5yb3V0ZS5zbmFwc2hvdDtcblxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVkVmlldy5zYXZlZEV4dHJhcy5xdWVyeVBhcmFtcyA9IGNvbnRleHRTbmFwc2hvdC5xdWVyeVBhcmFtcztcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlZFZpZXcuc2F2ZWRFeHRyYXMuZnJhZ21lbnQgPSBjb250ZXh0U25hcHNob3QuZnJhZ21lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNvbXBvbmVudDtcbiAgICAgIHRoaXMuYWN0aXZhdGVkVmlldyA9IG51bGw7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IG51bGw7XG4gICAgICB0aGlzLl9hY3RpdmF0ZWRSb3V0ZSA9IG51bGw7XG4gICAgICB0aGlzLmRlYWN0aXZhdGVFdmVudHMuZW1pdChjKTtcbiAgICB9XG4gIH1cblxuICBhY3RpdmF0ZVdpdGgoYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlLCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyIHwgbnVsbCkge1xuICAgIGlmICh0aGlzLmlzQWN0aXZhdGVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhY3RpdmF0ZSBhbiBhbHJlYWR5IGFjdGl2YXRlZCBvdXRsZXQnKTtcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZhdGVkUm91dGUgPSBhY3RpdmF0ZWRSb3V0ZTtcblxuICAgIGxldCBjbXBSZWY6IGFueTtcbiAgICBsZXQgZW50ZXJpbmdWaWV3ID0gdGhpcy5zdGFja0N0cmwuZ2V0RXhpc3RpbmdWaWV3KGFjdGl2YXRlZFJvdXRlKTtcbiAgICBpZiAoZW50ZXJpbmdWaWV3KSB7XG4gICAgICBjbXBSZWYgPSB0aGlzLmFjdGl2YXRlZCA9IGVudGVyaW5nVmlldy5yZWY7XG4gICAgICBjb25zdCBzYXZlZCA9IGVudGVyaW5nVmlldy5zYXZlZERhdGE7XG4gICAgICBpZiAoc2F2ZWQpIHtcbiAgICAgICAgLy8gc2VsZi1yZXN0b3JlXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLmdldENvbnRleHQoKSE7XG4gICAgICAgIGNvbnRleHQuY2hpbGRyZW5bJ2NvbnRleHRzJ10gPSBzYXZlZDtcbiAgICAgIH1cbiAgICAgIC8vIFVwZGF0ZWQgYWN0aXZhdGVkIHJvdXRlIHByb3h5IGZvciB0aGlzIGNvbXBvbmVudFxuICAgICAgdGhpcy51cGRhdGVBY3RpdmF0ZWRSb3V0ZVByb3h5KGNtcFJlZi5pbnN0YW5jZSwgYWN0aXZhdGVkUm91dGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBzbmFwc2hvdCA9IChhY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdDtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHNuYXBzaG90LnJvdXRlQ29uZmlnIS5jb21wb25lbnQgYXMgYW55O1xuICAgICAgcmVzb2x2ZXIgPSByZXNvbHZlciB8fCB0aGlzLnJlc29sdmVyO1xuXG4gICAgICBjb25zdCBmYWN0b3J5ID0gcmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29tcG9uZW50KTtcbiAgICAgIGNvbnN0IGNoaWxkQ29udGV4dHMgPSB0aGlzLnBhcmVudENvbnRleHRzLmdldE9yQ3JlYXRlQ29udGV4dCh0aGlzLm5hbWUpLmNoaWxkcmVuO1xuXG4gICAgICAvLyBXZSBjcmVhdGUgYW4gYWN0aXZhdGVkIHJvdXRlIHByb3h5IG9iamVjdCB0aGF0IHdpbGwgbWFpbnRhaW4gZnV0dXJlIHVwZGF0ZXMgZm9yIHRoaXMgY29tcG9uZW50XG4gICAgICAvLyBvdmVyIGl0cyBsaWZlY3ljbGUgaW4gdGhlIHN0YWNrLlxuICAgICAgY29uc3QgY29tcG9uZW50JCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8YW55PihudWxsKTtcbiAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdXRlUHJveHkgPSB0aGlzLmNyZWF0ZUFjdGl2YXRlZFJvdXRlUHJveHkoY29tcG9uZW50JCwgYWN0aXZhdGVkUm91dGUpO1xuXG4gICAgICBjb25zdCBpbmplY3RvciA9IG5ldyBPdXRsZXRJbmplY3RvcihhY3RpdmF0ZWRSb3V0ZVByb3h5LCBjaGlsZENvbnRleHRzLCB0aGlzLmxvY2F0aW9uLmluamVjdG9yKTtcbiAgICAgIGNtcFJlZiA9IHRoaXMuYWN0aXZhdGVkID0gdGhpcy5sb2NhdGlvbi5jcmVhdGVDb21wb25lbnQoZmFjdG9yeSwgdGhpcy5sb2NhdGlvbi5sZW5ndGgsIGluamVjdG9yKTtcblxuICAgICAgLy8gT25jZSB0aGUgY29tcG9uZW50IGlzIGNyZWF0ZWQgd2UgY2FuIHB1c2ggaXQgdG8gb3VyIGxvY2FsIHN1YmplY3Qgc3VwcGxpZWQgdG8gdGhlIHByb3h5XG4gICAgICBjb21wb25lbnQkLm5leHQoY21wUmVmLmluc3RhbmNlKTtcblxuICAgICAgLy8gQ2FsbGluZyBgbWFya0ZvckNoZWNrYCB0byBtYWtlIHN1cmUgd2Ugd2lsbCBydW4gdGhlIGNoYW5nZSBkZXRlY3Rpb24gd2hlbiB0aGVcbiAgICAgIC8vIGBSb3V0ZXJPdXRsZXRgIGlzIGluc2lkZSBhIGBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hgIGNvbXBvbmVudC5cbiAgICAgIGVudGVyaW5nVmlldyA9IHRoaXMuc3RhY2tDdHJsLmNyZWF0ZVZpZXcodGhpcy5hY3RpdmF0ZWQsIGFjdGl2YXRlZFJvdXRlKTtcblxuICAgICAgLy8gU3RvcmUgcmVmZXJlbmNlcyB0byB0aGUgcHJveHkgYnkgY29tcG9uZW50XG4gICAgICB0aGlzLnByb3h5TWFwLnNldChjbXBSZWYuaW5zdGFuY2UsIGFjdGl2YXRlZFJvdXRlUHJveHkpO1xuICAgICAgdGhpcy5jdXJyZW50QWN0aXZhdGVkUm91dGUkLm5leHQoeyBjb21wb25lbnQ6IGNtcFJlZi5pbnN0YW5jZSwgYWN0aXZhdGVkUm91dGUgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmF0ZWRWaWV3ID0gZW50ZXJpbmdWaWV3O1xuICAgIHRoaXMuc3RhY2tDdHJsLnNldEFjdGl2ZShlbnRlcmluZ1ZpZXcpLnRoZW4oZGF0YSA9PiB7XG4gICAgICB0aGlzLm5hdkN0cmwuc2V0VG9wT3V0bGV0KHRoaXMpO1xuICAgICAgdGhpcy5hY3RpdmF0ZUV2ZW50cy5lbWl0KGNtcFJlZi5pbnN0YW5jZSk7XG4gICAgICB0aGlzLnN0YWNrRXZlbnRzLmVtaXQoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlcmUgYXJlIHBhZ2VzIGluIHRoZSBzdGFjayB0byBnbyBiYWNrLlxuICAgKi9cbiAgY2FuR29CYWNrKGRlZXAgPSAxLCBzdGFja0lkPzogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhY2tDdHJsLmNhbkdvQmFjayhkZWVwLCBzdGFja0lkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyB0byBgdHJ1ZWAgaWYgaXQgdGhlIG91dGxldCB3YXMgYWJsZSB0byBzdWNlc3NmdWxseSBwb3AgdGhlIGxhc3QgTiBwYWdlcy5cbiAgICovXG4gIHBvcChkZWVwID0gMSwgc3RhY2tJZD86IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5wb3AoZGVlcCwgc3RhY2tJZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBhY3RpdmUgcGFnZSBvZiBlYWNoIHN0YWNrLlxuICAgKi9cbiAgZ2V0TGFzdFVybChzdGFja0lkPzogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCBhY3RpdmUgPSB0aGlzLnN0YWNrQ3RybC5nZXRMYXN0VXJsKHN0YWNrSWQpO1xuICAgIHJldHVybiBhY3RpdmUgPyBhY3RpdmUudXJsIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFJvdXRlVmlldyBvZiB0aGUgYWN0aXZlIHBhZ2Ugb2YgZWFjaCBzdGFjay5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZXRMYXN0Um91dGVWaWV3KHN0YWNrSWQ/OiBzdHJpbmcpOiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5nZXRMYXN0VXJsKHN0YWNrSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHJvb3QgdmlldyBpbiB0aGUgdGFiIHN0YWNrLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdldFJvb3RWaWV3KHN0YWNrSWQ/OiBzdHJpbmcpOiBSb3V0ZVZpZXcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5nZXRSb290VXJsKHN0YWNrSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFjdGl2ZSBzdGFjayBJRC4gSW4gdGhlIGNvbnRleHQgb2YgaW9uLXRhYnMsIGl0IG1lYW5zIHRoZSBhY3RpdmUgdGFiLlxuICAgKi9cbiAgZ2V0QWN0aXZlU3RhY2tJZCgpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnN0YWNrQ3RybC5nZXRBY3RpdmVTdGFja0lkKCk7XG4gIH1cblxuICAvKipcbiAgICogU2luY2UgdGhlIGFjdGl2YXRlZCByb3V0ZSBjYW4gY2hhbmdlIG92ZXIgdGhlIGxpZmUgdGltZSBvZiBhIGNvbXBvbmVudCBpbiBhbiBpb24gcm91dGVyIG91dGxldCwgd2UgY3JlYXRlXG4gICAqIGEgcHJveHkgc28gdGhhdCB3ZSBjYW4gdXBkYXRlIHRoZSB2YWx1ZXMgb3ZlciB0aW1lIGFzIGEgdXNlciBuYXZpZ2F0ZXMgYmFjayB0byBjb21wb25lbnRzIGFscmVhZHkgaW4gdGhlIHN0YWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBjcmVhdGVBY3RpdmF0ZWRSb3V0ZVByb3h5KGNvbXBvbmVudCQ6IE9ic2VydmFibGU8YW55PiwgYWN0aXZhdGVkUm91dGU6IEFjdGl2YXRlZFJvdXRlKTogQWN0aXZhdGVkUm91dGUge1xuICAgIGNvbnN0IHByb3h5OiBhbnkgPSBuZXcgQWN0aXZhdGVkUm91dGUoKTtcblxuICAgIHByb3h5Ll9mdXR1cmVTbmFwc2hvdCA9IChhY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdDtcbiAgICBwcm94eS5fcm91dGVyU3RhdGUgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fcm91dGVyU3RhdGU7XG4gICAgcHJveHkuc25hcHNob3QgPSBhY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdDtcbiAgICBwcm94eS5vdXRsZXQgPSBhY3RpdmF0ZWRSb3V0ZS5vdXRsZXQ7XG4gICAgcHJveHkuY29tcG9uZW50ID0gYWN0aXZhdGVkUm91dGUuY29tcG9uZW50O1xuXG4gICAgLy8gU2V0dXAgd3JhcHBlcnMgZm9yIHRoZSBvYnNlcnZhYmxlcyBzbyBjb25zdW1lcnMgZG9uJ3QgaGF2ZSB0byB3b3JyeSBhYm91dCBzd2l0Y2hpbmcgdG8gbmV3IG9ic2VydmFibGVzIGFzIHRoZSBzdGF0ZSB1cGRhdGVzXG4gICAgKHByb3h5IGFzIGFueSkuX3BhcmFtTWFwID0gdGhpcy5wcm94eU9ic2VydmFibGUoY29tcG9uZW50JCwgJ3BhcmFtTWFwJyk7XG4gICAgKHByb3h5IGFzIGFueSkuX3F1ZXJ5UGFyYW1NYXAgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAncXVlcnlQYXJhbU1hcCcpO1xuICAgIHByb3h5LnVybCA9IHRoaXMucHJveHlPYnNlcnZhYmxlKGNvbXBvbmVudCQsICd1cmwnKTtcbiAgICBwcm94eS5wYXJhbXMgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAncGFyYW1zJyk7XG4gICAgcHJveHkucXVlcnlQYXJhbXMgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAncXVlcnlQYXJhbXMnKTtcbiAgICBwcm94eS5mcmFnbWVudCA9IHRoaXMucHJveHlPYnNlcnZhYmxlKGNvbXBvbmVudCQsICdmcmFnbWVudCcpO1xuICAgIHByb3h5LmRhdGEgPSB0aGlzLnByb3h5T2JzZXJ2YWJsZShjb21wb25lbnQkLCAnZGF0YScpO1xuXG4gICAgcmV0dXJuIHByb3h5IGFzIEFjdGl2YXRlZFJvdXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHdyYXBwZWQgb2JzZXJ2YWJsZSB0aGF0IHdpbGwgc3dpdGNoIHRvIHRoZSBsYXRlc3QgYWN0aXZhdGVkIHJvdXRlIG1hdGNoZWQgYnkgdGhlIGdpdmVuIGNvbXBvbmVudFxuICAgKi9cbiAgcHJpdmF0ZSBwcm94eU9ic2VydmFibGUoY29tcG9uZW50JDogT2JzZXJ2YWJsZTxhbnk+LCBwYXRoOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIHJldHVybiBjb21wb25lbnQkLnBpcGUoXG4gICAgICAvLyBGaXJzdCB3YWl0IHVudGlsIHRoZSBjb21wb25lbnQgaW5zdGFuY2UgaXMgcHVzaGVkXG4gICAgICBmaWx0ZXIoY29tcG9uZW50ID0+ICEhY29tcG9uZW50KSxcbiAgICAgIHN3aXRjaE1hcChjb21wb25lbnQgPT5cbiAgICAgICAgdGhpcy5jdXJyZW50QWN0aXZhdGVkUm91dGUkLnBpcGUoXG4gICAgICAgICAgZmlsdGVyKGN1cnJlbnQgPT4gY3VycmVudCAhPT0gbnVsbCAmJiBjdXJyZW50LmNvbXBvbmVudCA9PT0gY29tcG9uZW50KSxcbiAgICAgICAgICBzd2l0Y2hNYXAoY3VycmVudCA9PiBjdXJyZW50ICYmIChjdXJyZW50LmFjdGl2YXRlZFJvdXRlIGFzIGFueSlbcGF0aF0pLFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgYWN0aXZhdGVkIHJvdXRlIHByb3h5IGZvciB0aGUgZ2l2ZW4gY29tcG9uZW50IHRvIHRoZSBuZXcgaW5jb21pbmcgcm91dGVyIHN0YXRlXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUFjdGl2YXRlZFJvdXRlUHJveHkoY29tcG9uZW50OiBhbnksIGFjdGl2YXRlZFJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSk6IHZvaWQge1xuICAgIGNvbnN0IHByb3h5ID0gdGhpcy5wcm94eU1hcC5nZXQoY29tcG9uZW50KTtcbiAgICBpZiAoIXByb3h5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIGFjdGl2YXRlZCByb3V0ZSBwcm94eSBmb3Igdmlld2ApO1xuICAgIH1cblxuICAgIChwcm94eSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdCA9IChhY3RpdmF0ZWRSb3V0ZSBhcyBhbnkpLl9mdXR1cmVTbmFwc2hvdDtcbiAgICAocHJveHkgYXMgYW55KS5fcm91dGVyU3RhdGUgPSAoYWN0aXZhdGVkUm91dGUgYXMgYW55KS5fcm91dGVyU3RhdGU7XG4gICAgcHJveHkuc25hcHNob3QgPSBhY3RpdmF0ZWRSb3V0ZS5zbmFwc2hvdDtcbiAgICBwcm94eS5vdXRsZXQgPSBhY3RpdmF0ZWRSb3V0ZS5vdXRsZXQ7XG4gICAgcHJveHkuY29tcG9uZW50ID0gYWN0aXZhdGVkUm91dGUuY29tcG9uZW50O1xuXG4gICAgdGhpcy5jdXJyZW50QWN0aXZhdGVkUm91dGUkLm5leHQoeyBjb21wb25lbnQsIGFjdGl2YXRlZFJvdXRlIH0pO1xuICB9XG59XG5cbmNsYXNzIE91dGxldEluamVjdG9yIGltcGxlbWVudHMgSW5qZWN0b3Ige1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSxcbiAgICBwcml2YXRlIGNoaWxkQ29udGV4dHM6IENoaWxkcmVuT3V0bGV0Q29udGV4dHMsXG4gICAgcHJpdmF0ZSBwYXJlbnQ6IEluamVjdG9yXG4gICkgeyB9XG5cbiAgZ2V0KHRva2VuOiBhbnksIG5vdEZvdW5kVmFsdWU/OiBhbnkpOiBhbnkge1xuICAgIGlmICh0b2tlbiA9PT0gQWN0aXZhdGVkUm91dGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnJvdXRlO1xuICAgIH1cblxuICAgIGlmICh0b2tlbiA9PT0gQ2hpbGRyZW5PdXRsZXRDb250ZXh0cykge1xuICAgICAgcmV0dXJuIHRoaXMuY2hpbGRDb250ZXh0cztcbiAgICB9XG5cbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQuZ2V0KHRva2VuLCBub3RGb3VuZFZhbHVlKTtcbiAgfVxufVxuIl19