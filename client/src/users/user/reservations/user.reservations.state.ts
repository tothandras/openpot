module op.users {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user.reservations', {
            templateUrl: 'user.reservations.tpl.html',
            data: {
                onMenu: false
            }
        });
    }

    angular.module('op.users')
        .config(config);
}
