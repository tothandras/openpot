module op.toolbar {
    'use strict';

    export interface IToolbarScope {
        loggedIn: boolean;
        menu: boolean;
        toggleMenu: () => void;
        name: string;
    }

    class ToolbarController implements IToolbarScope {
        loggedIn: boolean = false;
        menu: boolean = false;
        name: string = '';

        /* @ngInject */
        constructor(
            public $rootScope: ng.IRootScopeService,
            public $scope: ng.IScope,
            public $log: ng.ILogService,
            public $mdSidenav: any,
            public $state: ng.ui.IStateService,
            public SessionService: op.common.ISessionService,
            public EVENT_OPEN_LOGIN_DIALOG: string) {
                var self = this;

                this.name = SessionService.getName();
                this.loggedIn = !!this.name;

                $scope.$on(SessionService.sessionOpenedEvent, () => {
                    $scope.$applyAsync(() => {
                        self.loggedIn = true;
                        self.name = SessionService.getUserData().name;
                    });
                    $log.debug(self.loggedIn);
                });

                $scope.$on(SessionService.sessionClosedEvent, () => {
                    $scope.$applyAsync(() => {
                        self.loggedIn = false;
                        self.name = '';
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
            if (!this.loggedIn) {
                this.$rootScope.$broadcast(this.EVENT_OPEN_LOGIN_DIALOG, $event);
            } else {
                this.$state.go('user');
            }
        }
    }

    // register ToolbarController
    angular.module('op.toolbar')
        .controller('ToolbarController', ToolbarController);
}
