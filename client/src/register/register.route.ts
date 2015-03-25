module op.register {
    'use strict';

    /* @ngInject */
    function config($stateProvider: ng.ui.IStateProvider): void {
        $stateProvider.state('register', {
              url: '/register',
              templateUrl: 'register.tpl.html',
              controller: 'RegisterController',
              controllerAs: 'register',
              data: {
                  onMenu: false,
                  caption: 'Regisztráció',
                  icon: null // TODO
              }
        });
    }

    angular.module('op.register')
      .config(config);
}
