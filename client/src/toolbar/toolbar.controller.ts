module op.toolbar {
    'use strict';

    export interface IToolbarScope {
        loggedIn: boolean;
        menu: boolean;
        toggleMenu: () => void;
    }

    class ToolbarController implements IToolbarScope {
        loggedIn: boolean = false;
        menu: boolean = false;

        /* @ngInject */
        constructor(
            public $rootScope: ng.IRootScopeService,
            public $scope: ng.IScope,
            public $log: ng.ILogService,
            public $mdSidenav: any,
            public SessionService: op.common.ISessionService,
            public EVENT_OPEN_LOGIN_DIALOG: string) {
                var self = this;
                $scope.$on(SessionService.sessionOpenedEvent, () => {
                    $scope.$applyAsync(() => {
                        self.loggedIn = true;
                    });
                    $log.debug(self.loggedIn);
                });

                $scope.$on(SessionService.sessionClosedEvent, () => {
                    $scope.$applyAsync(() => {
                        self.loggedIn = false;
                    });
                    $log.debug(self.loggedIn);
                });

                $rootScope.$on('$stateChangeStart', () => this.menu = false);
        }

        toggleMenu(): void {
            this.$mdSidenav('left').toggle();
            this.menu = !this.menu;
        }

        openLoginDialog($event: ng.IAngularEvent): void {
            this.$rootScope.$broadcast(this.EVENT_OPEN_LOGIN_DIALOG, $event);
        }
    }

    // register ToolbarController
    angular.module('op.toolbar')
        .controller('ToolbarController', ToolbarController);
}
