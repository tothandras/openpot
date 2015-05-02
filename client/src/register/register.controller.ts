module op.register {
    'use strict';

    export interface IRegisterScope {
        register: () => void;
        closeDialog: () => void;
    }

    class RegisterController implements IRegisterScope {
        name: string = 'Register Controller';

        email: string;
        password: string;
        firstName: string;
        lastName: string;
        error: string;

        /* @ngInject */
        constructor(public $state: ng.ui.IStateService,
                    public RegisterDialogService: IRegisterDialogService,
                    public AuthService: op.common.IAuthService,
                    public $log: ng.ILogService) {
            $log.debug(this.name);
        }

        register(): void {
            this.error = null;
            var user = new op.common.RegisterUser();
            user.email = this.email;
            user.password = this.password;
            user.firstName = this.firstName;
            user.lastName = this.lastName;
            this.AuthService.register(user).then((response: any): void => {
                this.$log.debug(response);
                this.closeDialog();
            }, (error: any): void => {
                this.error = error;
            });
        }

        closeDialog(): void {
            this.RegisterDialogService.closeDialog();
        }
    }

    angular.module('op.register').controller('RegisterController', RegisterController);
}
