module op.login {
    'use strict';

    export interface ILoginDialogService {
        showDialog: ($event: ng.IAngularEvent) => ng.IPromise<any>;
        closeDialog: () => ng.IPromise<any>;
    }

    class LoginDialogService implements ILoginDialogService {

        /* @ngInject */
        constructor(private $log: ng.ILogService, private $mdDialog: any) {

        }

        showDialog($event: ng.IAngularEvent): ng.IPromise<any> {
            return this.$mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                templateUrl: 'login.tpl.html',
                controller: 'LoginController as dialog'
            });
        }

        closeDialog(): ng.IPromise<any> {
            return this.$mdDialog.hide();
        }
    }

    // register MenuService
    angular.module('op.login').service('LoginDialogService', LoginDialogService);
}
