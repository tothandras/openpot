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
        constructor(public $rootScope: ng.IRootScopeService,
                    public $state: ng.ui.IStateService,
                    public $q: ng.IQService,
                    public localStorageService: ng.local.storage.ILocalStorageService<IToken>,
                    public APIService: IAPIService,
                    public user: IUser,
                    public EVENT_LOGIN_REQUIRED: string) {
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

            $rootScope.$on(EVENT_LOGIN_REQUIRED, () => this.unsetUser());
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
            this.$state.transitionTo('home');
        }

        loggedIn(): boolean {
            return !!this.user.email;
        }
    }

    angular.module('op.common')
        .service('SessionService', SessionService);
}
