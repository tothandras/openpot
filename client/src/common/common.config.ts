module op.common {
    'use strict';

    /* @ngInject */
    function config(localStorageServiceProvider: ng.local.storage.ILocalStorageServiceProvider): void {
        localStorageServiceProvider.setPrefix('op');
    }

    angular.module('op.common')
        .config(config);
}
