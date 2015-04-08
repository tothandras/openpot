module op.home {
    'use strict';

    beforeEach((): void => {
        module('op.home');
    });

    describe('op.home.HomeController', (): void => {
        var createController: Function;
        var scope: any;

        function injected($injector: ng.auto.IInjectorService): void {
            var $rootScope: ng.IRootScopeService = $injector.get('$rootScope');
            var $controller: ng.IControllerService = $injector.get('$controller');
            scope = $rootScope.$new();
            createController = function(): void {
                $controller('HomeController as home', {
                    $scope: scope
                });
            }
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            createController();
            expect(scope.home).toBeDefined();
        });
    });

    describe('op.home.state', (): void => {
        var states: ng.ui.IState[];
        var homeState: ng.ui.IState = {
            url: '/',
            templateUrl: 'home.tpl.html',
            controller: 'HomeController',
            controllerAs: 'home'
        };

        function injected($injector: ng.auto.IInjectorService): void {
            var $state: ng.ui.IStateService = $injector.get('$state');
            states = $state.get();
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            var isState = false;
            states.forEach((state: ng.ui.IState) => {
                if (state.name === 'home') {
                    isState = true;
                    expect(state.url).toBe(homeState.url);
                    expect(state.templateUrl).toBe(homeState.templateUrl);
                    expect(state.controller).toBe(homeState.controller);
                    expect(state.controllerAs).toBe(homeState.controllerAs);
                }
            });
            expect(isState).toBeTruthy();
        });
    });

}
