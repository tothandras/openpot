module op.login {
    'use strict';

    export interface ILoginScope {
        name: string;

        username: string;
        password: string;
        loggedIn: boolean;
        login: () => void;
        logout: () => void;
        closeDialog: () => void;
    }

    class LoginController implements ILoginScope {
        name: string = 'Login Controller';

        username: string;
        password: string;
        loggedIn: boolean;

        /* @ngInject */
        constructor(
            public LoginService: op.common.ILoginService,
            public $rootScope: ng.IRootScopeService,
            public SessionService: op.common.ISessionService,
            public $state: ng.ui.IStateService,
            public $mdDialog: any,
            public $log: ng.ILogService) {
            // TODO EVENT!!!
            this.loggedIn = !!SessionService.getUserData();
        }

        login(): void {
            this.LoginService.login(this.username, this.password)
                .then((response: any): void => {
                this.$log.debug(response);
                // TODO EVENT!!!
                this.loggedIn = !!this.SessionService.getUserData();
            });
        }

        logout(): void {
            // TODO EVENT!!!
            this.loggedIn = !!this.SessionService.getUserData();
            if (this.loggedIn) {
                this.LoginService.logout()
                    .then((response: any): void => {
                    this.$state.go('home');
                });
            }
        }

        closeDialog(): void {
            this.$mdDialog.hide();
        }

        loginDialog(): void {
            this.closeDialog();
            this.login();
        }
    }

    // register LoginController
    angular.module('op.login')
        .controller('LoginController', LoginController);
}
