module op.login {
    'use strict';

    export interface ILoginScope {
        login: () => void;
        logout: () => void;
        closeDialog: () => void;
    }

    class LoginController implements ILoginScope {
        name: string = 'Login Controller';

        email: string;
        password: string;
        loggedIn: boolean;
        error: string;

        /* @ngInject */
        constructor(public AuthService: op.common.IAuthService,
                    public SessionService: op.common.ISessionService,
                    public $state: ng.ui.IStateService,
                    public LoginDialogService: ILoginDialogService,
                    public $log: ng.ILogService) {
            $log.debug(this.name);
        }

        login(): void {
            this.error = null;
            this.AuthService.login(this.email, this.password).then((response: any): void => {
                this.$log.debug(response);
                this.LoginDialogService.closeDialog();
            }, (error: any): void => {
                this.error = error;
            });
        }

        logout(): void {
            if (this.SessionService.loggedIn()) {
                this.AuthService.logout();
                this.LoginDialogService.closeDialog();
                this.$state.go('home');
            }
        }

        closeDialog(): void {
            this.LoginDialogService.closeDialog();
        }
    }

    angular.module('op.login').controller('LoginController', LoginController);
}
