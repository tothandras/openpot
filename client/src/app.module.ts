module op {
    'use strict';

    // register chat module
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
        'op.login',
        'op.register',
        'op.toolbar',
        /* Third party */
        'ui.router'
    ]);
}
