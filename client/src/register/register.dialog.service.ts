module op.register {
    'use strict';

    export interface IRegisterDialogService {
        showDialog: ($event: ng.IAngularEvent) => void;
        closeDialog: () => void;
    }

    class RegisterDialogService implements IRegisterDialogService {

        /* @ngInject */
        constructor(private $log: ng.ILogService, private $mdDialog: any) {

        }

        showDialog($event: ng.IAngularEvent): void {
            this.$mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                templateUrl: 'register.tpl.html',
                controller: 'RegisterController as dialog'
            });
        }

        closeDialog(): void {
            this.$mdDialog.hide();
        }
    }

    // register MenuService
    angular.module('op.register').service('RegisterDialogService', RegisterDialogService);
}
