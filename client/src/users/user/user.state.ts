module op.users {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user', {
            url: '/user/:id',
            abstract: true,
            templateUrl: 'user.tpl.html',
            controller: 'UserController',
            controllerAs: 'user',
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
