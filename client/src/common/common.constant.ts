module op.common {
    'use strict';

    var API_URL = '/api';
    var AUTH_URL = '/auth';

    angular.module('op.common')
        .constant('API_URL', API_URL)
        .constant('AUTH_URL', AUTH_URL);
}
