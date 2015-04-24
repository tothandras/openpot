module op.common {
    'use strict';

    var user;

    /* @ngInject */
     function getUser(): IUser {
         if (!user) {
             user = new User();
         }
         return user;
     }

    angular.module('op.common')
        .constant('user', getUser());
}
