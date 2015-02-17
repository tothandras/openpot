module op.login {
    'use strict';

    beforeEach((): void => {
        module('op.login');
    });

    describe('op.login.LoginController', () => {
        var createController: Function;
        var scope: any;

        function injected($injector: ng.auto.IInjectorService): void {
            var $rootScope: ng.IRootScopeService = $injector.get('$rootScope');
            var $controller: ng.IControllerService = $injector.get('$controller');
            scope = $rootScope.$new();
            createController = function(): void {
                $controller('LoginController as login', {
                    $scope: scope
                });
            }
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            createController();
            expect(scope.login).toBeDefined();
        });
    });

}
