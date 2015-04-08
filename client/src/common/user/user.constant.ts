module op.common {
    'use strict';

    export interface IToken {
        id: string;
        email: string;
        token: string;
    }

    export class Token implements IToken {
        id: string;
        email: string;
        token: string;

        constructor(id: string, email: string, token: string) {
            this.id = id;
            this.email = email;
            this.token = token;
        }
    }

    export interface IUser {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        imageURL: string;
        //location: string;
        description: string;
    }

    export class User implements IUser {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        imageURL: string;
        //location: string;
        description: string;

        constructor(obj?: any) {
            this.id = obj && obj.id || '';
            this.email = obj && obj.email || '';
            this.firstName = obj && obj.firstName || '';
            this.lastName = obj && obj.lastName || '';
            this.imageURL = obj && obj.imageURL || '';
            //this.location = obj && obj.location || '';
            this.description = obj && obj.description || '';
        }
    }

    angular.module('op.common')
        .constant('Token', Token)
        .constant('User', User);
}
