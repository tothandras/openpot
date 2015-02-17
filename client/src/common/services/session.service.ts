module op.common {
    'use strict';

    export interface IUser {
        token: string;
        name: string;
        admin: boolean;
    }

    export interface ISessionService {
        user: IUser;

        getName: () => string;
        getToken: () => string;
        isAdmin: () => boolean;
        setUserData: (token: string, name: string, admin: boolean) => void;
        deleteUser: () => void;
    }

    class SessionService implements ISessionService {
        user: IUser;

        /* @ngInject */
        constructor(private localStorageService: ng.local.storage.ILocalStorageService<IUser>) {

        }

        getName(): string {
            var user: IUser = this.localStorageService.get('user');
            return user ? user.name : null;
        }

        getToken(): string {
            var user: IUser = this.localStorageService.get('user');
            return user ? user.token : null;
        }

        isAdmin(): boolean {
            var user: IUser = this.localStorageService.get('user');
            return user ? user.admin : null;
        }

        setUserData(name: string, token: string, admin: boolean = false): void {
            var user: IUser = {
                name: name,
                token: token,
                admin: admin
            };
            this.localStorageService.set('user', user);
        }

        deleteUser(): void {
            this.localStorageService.remove('user');
        }
    }

    // register SessionService
    angular.module('op.common')
        .service('SessionService', SessionService);
}
