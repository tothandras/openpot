module op.users {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user', {
            url: '/user/:id',
            templateUrl: 'user.tpl.html',
            controller: 'UserController',
            controllerAs: 'user',
            resolve: {
            },
            data: {
                onMenu: true,
                caption: 'Felhasználó',
                icon: null // TODO
            }
        });
    }

    angular.module('op.users')
        .config(config);
}
