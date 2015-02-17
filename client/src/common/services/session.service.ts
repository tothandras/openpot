module op.common {
    'use strict';

    export interface IUser {
        token: string;
        name: string;
        admin: boolean;
    }

    export interface ISessionService {
        user: IUser;

        getToken: () => Token;
        getUsername: () => string;
        isAdmin: () => boolean;
        setUserData: (token: Token, name: string, admin: boolean) => void;
    }

    class SessionService implements ISessionService {
        user: IUser;

        /* @ngInject */
        constructor(private localStorageService: ng.local.storage.ILocalStorageService<IUser>) {

        }

        getToken(): Token {
            return this.user.token;
        }

        getUsername(): string {
            return this.user.name;
        }

        isAdmin(): boolean {
            return this.user.admin;
        }

        setUserData(token: Token, name: string, admin: boolean): void {
            this.user.token = token;
            this.user.name = name;
            this.user.admin = admin;
        }

        deleteToken(): void {
            this.localStorageService.remove('token')
        }
    }

    // register SessionService
    angular.module('op.common')
        .service('SessionService', SessionService);
}
