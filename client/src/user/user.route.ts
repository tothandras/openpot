module op.user {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user', {
            url: '/user',
            templateUrl: 'user.tpl.html',
            controller: 'UserController',
            controllerAs: 'user',
            data: {
                onMenu: true,
                caption: 'Felhasználó',
                icon: null // TODO
            }
        });
    }

    angular.module('op.user')
        .config(config);
}
