module op.users {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user.pot', {
            url: '/pot/:id',
            templateUrl: 'user.pot.tpl.html',
            controller: 'PotController',
            controllerAs: 'pot',
            resolve: {
            },
            data: {
                onMenu: false
            }
        });
    }

    angular.module('op.users')
        .config(config);
}
