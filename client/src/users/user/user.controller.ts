module op.users {
    'use strict';

    export interface IUserScope {
        data: op.common.IUser;
        id: string;
        myUser: op.common.IUser;
    }

    class UserController implements IUserScope {
        name: string = 'User Controller';
        data: op.common.IUser;
        id: string;
        myUser: op.common.IUser;

        /* @ngInject */
        constructor(
            public $log: ng.ILogService,
            public $stateParams: any,
            public SessionService: op.common.ISessionService,
            public APIService: op.common.IAPIService) {
            $log.debug(this.name);

            this.myUser = SessionService.getUser();
            if ($stateParams.id) {
                this.id = $stateParams.id;
                APIService.getUserData(this.id).then((data: op.common.IUser) => {
                    this.data = data;
                });
            } else if (this.myUser) {
                this.id = this.myUser.id;
                APIService.getUserData(this.id).then((data: op.common.IUser) => {
                    this.data = data;
                });
            }
        }
    }

    angular.module('op.users')
        .controller('UserController', UserController);
}
