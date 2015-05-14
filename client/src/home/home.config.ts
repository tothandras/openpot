module op.home {
    'use strict';

    /* @ngInject */
    function config(uiGmapGoogleMapApiProvider: any): void {
        uiGmapGoogleMapApiProvider.configure({
            v: '3.17',
            libraries: 'places',
            region: 'HU'
        });
    }

    angular.module('op.home')
        .config(config);
}
