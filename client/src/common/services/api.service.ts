module op.common {
    'use strict';

    export interface IAPIService {

    }

    class APIService implements IAPIService {


        /* @ngInject */
        constructor() {

        }
    }

    // register APIService
    angular.module('op.common')
        .service('APIService', APIService);
}
