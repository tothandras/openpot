module op.common {
    'use strict';

    export interface IToken {
        user: IUser;
        token: string;
    }

    export class Token implements IToken {
        user: IUser;
        token: string;

        constructor(user: IUser, token: string) {
            this.user = user;
            this.token = token;
        }
    }

    export interface IUser {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        description: string;
        phone: string;
        stars: number;
        following: string[];
        image: string;

        setUser: (obj?: any) => void;
        unsetUser: () => void;
    }

    export class User implements IUser {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        description: string;
        phone: string;
        stars: number;
        following: string[];
        image: string;

        constructor(obj?: any) {
            this.setUser(obj);
        }

        setUser(obj?: any): void {
            this.id = obj && obj.id || '';
            this.email = obj && obj.email || '';
            this.firstName = obj && obj.firstName || '';
            this.lastName = obj && obj.lastName || '';
            this.description = obj && obj.description || '';
            this.phone = obj && obj.phone || '';
            this.stars = obj && obj.stars || 0;
            this.following = obj && obj.stars || [];
        }

        unsetUser(): void {
            this.id = this.email = this.firstName = this.lastName = this.description = this.phone = this.image = '';
            this.stars = 1;
            this.following = [];
        }
    }

    export class RegisterUser extends User {
        password: string;
    }

    angular.module('op.common')
        .constant('Token', Token)
        .constant('User', User);
}
