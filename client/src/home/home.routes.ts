module op.home {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('home', {
              url: '/',
              templateUrl: 'home.tpl.html',
              controller: 'HomeController',
              controllerAs: 'home',
              data: {
                  onMenu: true,
                  caption: 'Home',
                  icon: null // TODO
              }
        });
    }

    angular.module('op.home')
      .config(config);
}
