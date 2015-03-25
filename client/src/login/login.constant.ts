module op.login {
    'use strict';

    var EVENT_OPEN_LOGIN_DIALOG = 'event:open-login-dialog';

    angular.module('op.login')
      .constant('EVENT_OPEN_LOGIN_DIALOG', EVENT_OPEN_LOGIN_DIALOG);
}
