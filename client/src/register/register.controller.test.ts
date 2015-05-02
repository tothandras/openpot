module op.register {
    'use strict';

    beforeEach((): void => {
        module('op.register');
    });

    describe('op.register.RegisterController', () => {
        var createController: Function;
        var scope: any;

        function injected($injector: ng.auto.IInjectorService): void {
            var $rootScope: ng.IRootScopeService = $injector.get('$rootScope');
            var $controller: ng.IControllerService = $injector.get('$controller');
            scope = $rootScope.$new();
            createController = function(): void {
                $controller('RegisterController as register', {
                    $scope: scope
                });
            }
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            createController();
            expect(scope.register).toBeDefined();
        });
    });

}
