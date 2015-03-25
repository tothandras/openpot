module op.common {
    'use strict';

    /* @ngInject */
    var EVENT_LOGIN_REQUIRED = 'event:auth-loginRequired';
    var EVENT_AUTH_FORBIDDEN = 'event:auth-forbidden';
    var EVENT_BAD_CREDITENTALS = 'event:bad-creditentals';

    angular.module('op.common')
        .constant('EVENT_BAD_CREDITENTALS', EVENT_BAD_CREDITENTALS)
        .constant('EVENT_LOGIN_REQUIRED', EVENT_LOGIN_REQUIRED)
        .constant('EVENT_AUTH_FORBIDDEN', EVENT_AUTH_FORBIDDEN);
}
