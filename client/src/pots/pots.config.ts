module op.pots {
    'use strict';

    /* @ngInject */
    function config(uiGmapGoogleMapApiProvider: any): void {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'geometry,visualization'
        });
    }

    angular.module('op.pots')
        .config(config);
}
