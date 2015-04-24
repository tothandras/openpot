module op.pots {
    'use strict';

    beforeEach((): void => {
        module('op.pots');
    });

    describe('op.pots.PotsController', (): void => {
        var createController: Function;
        var scope: any;

        function injected($injector: ng.auto.IInjectorService): void {
            var $rootScope: ng.IRootScopeService = $injector.get('$rootScope');
            var $controller: ng.IControllerService = $injector.get('$controller');
            scope = $rootScope.$new();
            createController = function(): void {
                $controller('PotsController as pots', {
                    $scope: scope
                });
            }
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            createController();
            expect(scope.pots).toBeDefined();
        });
    });

    describe('op.pots.state', (): void => {
        var states: ng.ui.IState[];
        var potsState: ng.ui.IState = {
            url: '/pots',
            templateUrl: 'pots.tpl.html',
            controller: 'PotsController',
            controllerAs: 'pots'
        };

        function injected($injector: ng.auto.IInjectorService): void {
            var $state: ng.ui.IStateService = $injector.get('$state');
            states = $state.get();
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            var isState = false;
            states.forEach((state: ng.ui.IState) => {
                if (state.name === potsState.controllerAs) {
                    isState = true;
                    expect(state.url).toBe(potsState.url);
                    expect(state.templateUrl).toBe(potsState.templateUrl);
                    expect(state.controller).toBe(potsState.controller);
                    expect(state.controllerAs).toBe(potsState.controllerAs);
                }
            });
            expect(isState).toBeTruthy();
        });
    });

}
