module op.register {
    'use strict';

    export interface IRegisterScope {

    }

    class RegisterController implements IRegisterScope {
        name: string;

        /* @ngInject */
        constructor() {
            this.name = 'Register Controller';
        }
    }

    // register RegisterController
    angular.module('op.register')
        .controller('RegisterController', RegisterController);
}
