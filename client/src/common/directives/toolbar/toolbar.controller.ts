module op.common {
    'use strict';

    export interface IToolbarScope {
        openMenu: () => void;
    }

    class ToolbarController implements IToolbarScope {
        loggedIn: boolean = false;

        /* @ngInject */
        constructor(
            public $scope: ng.IScope,
            public $mdSidenav: any,
            public SessionService: op.common.ISessionService) {
                var self = this;
                $scope.$on(SessionService.sessionOpenedEvent, () => {
                    $scope.$applyAsync(() => {
                        self.loggedIn = true;
                    });
                    console.log(self.loggedIn);
                });

                $scope.$on(SessionService.sessionClosedEvent, () => {
                    $scope.$applyAsync(() => {
                        self.loggedIn = false;
                    });
                    console.log(self.loggedIn);
                });
        }

        openMenu(): void {
            this.$mdSidenav('left').toggle();
        }
    }

    // register ToolbarController
    angular.module('op.common')
        .controller('ToolbarController', ToolbarController);
}
