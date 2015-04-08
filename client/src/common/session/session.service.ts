module op.common {
    'use strict';

    export interface ISessionService {
        setUser: (token: IToken) => void;
        getUser: () => IUser;
        unsetUser: () => void;
        loggedIn: () => boolean;
        token: IToken;
    }

    class SessionService implements ISessionService {
        key: string = 'user';
        token: IToken;

        /* @ngInject */
        constructor(public localStorageService: ng.local.storage.ILocalStorageService<IToken>,
                    public APIService: IAPIService,
                    public user: IUser) {
            this.token = localStorageService.get(this.key);
            if (this.token && this.token.id) {
                APIService.getUserData(this.token.id).then((u: IUser) => {
                    user = u;
                });
            }
        }

        setUser(token: IToken): void {
            this.token = token;
            this.localStorageService.set(this.key, token);
            this.APIService.getUserData(this.token.id).then((u: IUser) => {
                this.user = u;
            });
        }

        getUser(): IUser {
            return this.user;
        }

        unsetUser(): void {
            this.localStorageService.remove(this.key);
            this.user = null;
        }

        loggedIn(): boolean {
            return !!this.user;
        }
    }

    // register SessionService
    angular.module('op.common')
        .service('SessionService', SessionService);
}
