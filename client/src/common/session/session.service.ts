module op.common {
    'use strict';

    export interface ISessionService {
        setUser: (token: IToken) => void;
        getUser: () => ng.IPromise<IUser>;
        unsetUser: () => void;
        loggedIn: () => boolean;
        tokenObject: IToken;
    }

    class SessionService implements ISessionService {
        key: string = 'user';
        tokenObject: IToken;

        /* @ngInject */
        constructor(public $q: ng.IQService,
                    public localStorageService: ng.local.storage.ILocalStorageService<IToken>,
                    public APIService: IAPIService,
                    public user: IUser) {
            this.tokenObject = localStorageService.get(this.key);
            if (this.tokenObject && this.tokenObject.token) {
                if (this.tokenObject.user) {
                    user.setUser(this.tokenObject.user);
                } else {
                    APIService.getUserData(this.tokenObject.token).then((u: IUser) => {
                        user.setUser(u);
                    });
                }
            }
        }

        setUser(token: IToken): void {
            this.tokenObject = token;
            this.localStorageService.set(this.key, token);
            this.user.setUser(token.user);
        }

        getUser(): ng.IPromise<IUser> {
            var deferred: ng.IDeferred<IUser> = this.$q.defer();
            deferred.resolve(this.user);
            return deferred.promise;
        }

        unsetUser(): void {
            this.localStorageService.remove(this.key);
            this.user.unsetUser();
        }

        loggedIn(): boolean {
            return !!this.user.email;
        }
    }

    // register SessionService
    angular.module('op.common')
        .service('SessionService', SessionService);
}
