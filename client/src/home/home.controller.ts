module op.home {
    'use strict';

    export interface IHomeScope {
        name: string;
    }

    class HomeController implements IHomeScope {
        name: string;

        /* @ngInject */
        constructor() {
            this.name = 'Home Controller';
        }
    }

    // register HomeController
    angular.module('op.home')
        .controller('HomeController', HomeController);
}
