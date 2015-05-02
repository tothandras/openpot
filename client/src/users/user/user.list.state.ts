module op.users {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('user.list', {
            url: '',
            templateUrl: 'user.list.tpl.html',
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
