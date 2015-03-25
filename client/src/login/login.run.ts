module op.login {
    'use strict';

    /* @ngInject */
    function run(
        EVENT_BAD_CREDITENTALS: string,
        EVENT_OPEN_LOGIN_DIALOG: string,
        EVENT_LOGIN_REQUIRED: string,
        $rootScope: ng.IRootScopeService,
        $mdDialog: any): void {

        var showDialog = function($event: ng.IAngularEvent): void {
            $mdDialog.show({
                parent: angular.element(document.body),
                targetEvent: $event,
                templateUrl: 'loginDialog.tpl.html',
                controller: 'LoginController as dialog'
            });
        }

        var showError = function(message: string): void {
            var alert = $mdDialog.alert({
                title: 'Hiba',
                content: message,
                ok: 'Bezárás'
            });
            $mdDialog.show(alert);
        }

        $rootScope.$on(EVENT_OPEN_LOGIN_DIALOG,
            (e: ng.IAngularEvent, $event: ng.IAngularEvent) => showDialog($event || e));

        $rootScope.$on(EVENT_BAD_CREDITENTALS, () => showError('Rossz felhasználónév vagy jelszó'));
    }

    angular.module('op.login')
        .run(run);
}
