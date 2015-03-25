module op.login {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('login', {
              url: '/login',
              templateUrl: 'login.tpl.html',
              controller: 'LoginController',
              controllerAs: 'login',
              data: {
                  onMenu: true,
                  caption: 'Bejelentkezés',
                  icon: null // TODO
              }
        });
    }

    angular.module('op.login')
      .config(config);
}
