module op.login {
    'use strict';

    export interface ILoginScope {
        name: string;

        username: string;
        password: string;
        loggedIn: boolean;
        login: () => void;
        logout: () => void;
    }

    class LoginController implements ILoginScope {
        name: string = 'Login Controller';

        username: string;
        password: string;
        loggedIn: boolean;

        /* @ngInject */
        constructor(
            public LoginService: op.common.ILoginService,
            public SessionService: op.common.ISessionService,
            public $state: ng.ui.IStateService) {
            // TODO EVENT!!!
            this.loggedIn = !!SessionService.getUserData();
        }

        login(): void {
            this.LoginService.login(this.username, this.password)
                .then((response: any): void => {
                    console.log(response);
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
    }

    // register LoginController
    angular.module('op.login')
        .controller('LoginController', LoginController);
}
