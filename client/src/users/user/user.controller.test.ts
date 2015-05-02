module op.user {
    'use strict';

    beforeEach((): void => {
        module('op.users');
    });

    describe('op.users.UserController', () => {
        var createController: Function;
        var scope: any;

        function injected($injector: ng.auto.IInjectorService): void {
            var $rootScope: ng.IRootScopeService = $injector.get('$rootScope');
            var $controller: ng.IControllerService = $injector.get('$controller');
            scope = $rootScope.$new();
            createController = function(): void {
                $controller('UserController as user', {
                    $scope: scope
                });
            }
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            createController();
            expect(scope.user).toBeDefined();
        });
    });

}
