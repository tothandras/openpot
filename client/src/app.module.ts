module op {
    'use strict';

    // register chat module
    angular.module('op', [
        /* Core */
        'ngMaterial',
        /* Generated */
        'template',
        'config',
        /* App */
        'op.common',
        'op.home',
        'op.login',
        /* Third party */
        'ui.router'
    ]);
}
