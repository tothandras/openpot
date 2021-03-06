module op.pots {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('pots', {
            url: '/pots?search',
            templateUrl: 'pots.tpl.html',
            controller: 'PotsController',
            controllerAs: 'pots',
            data: {
                onMenu: true,
                caption: 'Böngészés',
                title: 'Böngészés',
                icon: null
            }
        });
    }

    angular.module('op.pots')
        .config(config);
}
