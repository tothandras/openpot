module op.login {
    'use strict';

    export interface ILoginScope {
        name: string;

        username: string;
        password: string;
        login: () => void
    }

    class LoginController implements ILoginScope {
        name: string;

        username: string;
        password: string;

        /* @ngInject */
        constructor(
            private LoginService: op.common.ILoginService,
            private SessionService: op.common.ISessionService) {
            this.name = 'Login Controller';
        }

        login(): void {
            this.LoginService.login(this.username, this.password)
                .then((response: any): void => {
                    console.log(response);
                });
        }
    }

    // register LoginController
    angular.module('op.login')
        .controller('LoginController', LoginController);
}
