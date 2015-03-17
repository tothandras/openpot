module op.common {
    'use strict';

    export interface IUser {
        token: string;
        name: string;
        admin: boolean;
    }

    export interface ISessionService {
        sessionOpenedEvent: string;
        sessionClosedEvent: string;

        getName: () => string;
        getToken: () => string;
        isAdmin: () => boolean;
        setUserData: (token: string, name: string, admin: boolean) => void;
        getUserData: () => IUser;
        unsetUser: () => void;
    }

    class SessionService implements ISessionService {
        key: string = 'user';
        sessionOpenedEvent: string = 'sessionOpened';
        sessionClosedEvent: string = 'sessionClosed';

        /* @ngInject */
        constructor(
            public $http: ng.IHttpService,
            public localStorageService: ng.local.storage.ILocalStorageService<IUser>,
            public $rootScope: ng.IRootScopeService) {
            this.openEvent();
        }

        getName(): string {
            var user: IUser = this.localStorageService.get(this.key);
            return user ? user.name : null;
        }

        getToken(): string {
            var user: IUser = this.localStorageService.get(this.key);
            return user ? user.token : null;
        }

        isAdmin(): boolean {
            var user: IUser = this.localStorageService.get(this.key);
            return user ? user.admin : null;
        }

        setUserData(name: string, token: string, admin: boolean = false): void {
            var user: IUser = {
                name: name,
                token: token,
                admin: admin
            };
            this.localStorageService.set(this.key, user);
            this.openEvent();
        }

        getUserData(): IUser {
            return this.localStorageService.get(this.key);
        }

        unsetUser(): void {
            this.localStorageService.remove(this.key);
            this.closeEvent();
        }

        openEvent(): void {
            if (!!this.getUserData) {
                this.$rootScope.$broadcast(this.sessionOpenedEvent);
                this.$http.defaults.headers.common.Authorization = 'Bearer ' + this.getToken();
            }
        }

        closeEvent(): void {
            this.$rootScope.$broadcast(this.sessionClosedEvent);
            this.$http.defaults.headers.common.Authorization = null;
        }
    }

    // register SessionService
    angular.module('op.common')
        .service('SessionService', SessionService);
}
