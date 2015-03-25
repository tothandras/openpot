module op.user {
    'use strict';

    export interface IUserScope {
        data: op.common.IUserData;
    }

    class UserController implements IUserScope {
        data: op.common.IUserData;

            /* @ngInject */
        constructor(
            public APIService: op.common.IAPIService) {
            APIService.getUserData().then((data: op.common.IUserData) => {
                this.data = data;
            });
        }
    }

    // register UserController
    angular.module('op.user')
        .controller('UserController', UserController);
}
