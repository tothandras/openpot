module op.toolbar {
    'use strict';

    export interface IToolbarScope {
        toggleMenu: () => void;
        openLoginDialog: ($event: ng.IAngularEvent) => void;
    }

    class ToolbarController implements IToolbarScope {
        name: string = 'Toolbar Controller';
        user: op.common.IUser;

        /* @ngInject */
        constructor(public $log: ng.ILogService,
                    public $mdSidenav: any,
                    public LoginDialogService: op.login.ILoginDialogService,
                    public SessionService: op.common.ISessionService) {
            $log.debug(this.name);
            this.user = SessionService.getUser();
        }

        toggleMenu(): void {
            this.$mdSidenav('left').toggle();
        }

        openLoginDialog($event: ng.IAngularEvent): void {
            this.LoginDialogService.showDialog($event);
        }
    }

    angular.module('op.toolbar')
        .controller('ToolbarController', ToolbarController);
}
