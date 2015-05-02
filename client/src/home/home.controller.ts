module op.home {
    'use strict';

    export interface IHomeScope {
        name: string;
    }

    class HomeController implements IHomeScope {
        name: string = 'Home Controller';

        /* @ngInject */
        constructor($log: ng.ILogService) {
            $log.debug(this.name);
        }
    }

    angular.module('op.home')
        .controller('HomeController', HomeController);
}
