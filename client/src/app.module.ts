module op {
    'use strict';

    angular.module('op', [
        /* Core */
        'ngMaterial',
        'ngMessages',
        /* Generated */
        'template',
        'config',
        /* App */
        'op.common',
        'op.home',
        'op.pots',
        'op.toolbar',
        'op.users',
        /* Third party */
        'ui.router'
    ]);
}
