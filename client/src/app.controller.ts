module op {
    'use strict';

    export interface IAppScope {
        name: string;
        title: string;
    }

    class AppController implements IAppScope {
        name: string = 'App Controller';
        titlePrefix: string = 'OpenPot';
        title: string = 'OpenPot';

        /* @ngInject */
        constructor($scope: ng.IScope,
                    $log: ng.ILogService) {
            $scope.$on('$stateChangeSuccess', (e: ng.IAngularEvent, toState: ng.ui.IState) => {
                if (angular.isDefined(toState.data.title)) {
                    this.title = this.titlePrefix + ' | ' + toState.data.title;
                }
            });
        }
    }

    angular.module('op')
        .controller('AppController', AppController);
}
