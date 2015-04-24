module op.users {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user.newpot', {
            templateUrl: 'user.newpot.tpl.html',
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
