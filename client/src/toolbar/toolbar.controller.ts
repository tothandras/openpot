module op.toolbar {
    'use strict';

    export interface IToolbarScope {
        toggleMenu: () => void;
        openLoginDialog: ($event: ng.IAngularEvent) => void;
        openRegistrationDialog: ($event: ng.IAngularEvent) => void;
        goToUser: () => void;
        newPot: () => void;
        logout: () => void;
    }

    class ToolbarController implements IToolbarScope {
        name: string = 'Toolbar Controller';
        user: op.common.IUser;
        dropdown: boolean = false;

        /* @ngInject */
        constructor(public $log: ng.ILogService,
                    public $mdSidenav: any,
                    public $state: ng.ui.IStateService,
                    public LoginDialogService: op.login.ILoginDialogService,
                    public RegisterDialogService: op.register.IRegisterDialogService,
                    public SessionService: op.common.ISessionService) {
            SessionService.getUser().then((user: op.common.IUser) => {
                this.user = user;
            });
        }

        toggleMenu(): void {
            this.$mdSidenav('left').toggle();
        }

        openRegistrationDialog($event: ng.IAngularEvent): void {
            this.RegisterDialogService.showDialog($event);
        }

        openLoginDialog($event: ng.IAngularEvent): void {
            this.LoginDialogService.showDialog($event);
        }

        goToUser(): void {
            this.dropdown = false;
            this.$state.transitionTo('user.list');
        }

        newPot(): void {
            this.dropdown = false;
            this.$state.transitionTo('user.newpot');
        }

        logout(): void {
            this.dropdown = false;
            this.SessionService.unsetUser();
        }

        toggleDropdown(): void {
            this.dropdown = !this.dropdown;
        }
    }

    angular.module('op.toolbar')
        .controller('ToolbarController', ToolbarController);
}
