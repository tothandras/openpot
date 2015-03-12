module op.common {
    'use strict';

    beforeEach(() => {
        module('op.common');
    });

    describe('op.common.SessionService', () => {
        var sessionService: any;
        var localStorageService: ng.local.storage.ILocalStorageService<any>;

        function injected($injector: ng.auto.IInjectorService): void {
            sessionService = $injector.get('SessionService');
            localStorageService = $injector.get('localStorageService');
            sessionService.deleteUser();
        }

        beforeEach(inject(injected));

        it('should be defined', () => {
            expect(sessionService).toBeDefined();
            expect(sessionService.getName).toEqual(jasmine.any(Function));
            expect(sessionService.getToken).toEqual(jasmine.any(Function));
            expect(sessionService.isAdmin).toEqual(jasmine.any(Function));
            expect(sessionService.setUserData).toEqual(jasmine.any(Function));
            expect(sessionService.deleteUser).toEqual(jasmine.any(Function));
        });

        it('should save the token to localStorage', () => {
            expect(localStorageService.get('user')).toBeNull();

            sessionService.setUserData('username', 'token');
            var user: any = localStorageService.get('user');
            expect(user.name).toEqual('username');
            expect(user.token).toEqual('token');
            expect(user.admin).toEqual(false);

            sessionService.setUserData('admin', 'admin-token', true);
            var adminUser: any = localStorageService.get('user');
            expect(adminUser.name).toEqual('admin');
            expect(adminUser.token).toEqual('admin-token');
            expect(adminUser.admin).toEqual(true);
        });

        it('should have getter functions for user data', () => {
            expect(sessionService.getName()).toBeNull();
            expect(sessionService.getToken()).toBeNull();
            expect(sessionService.isAdmin()).toBeNull();
            sessionService.setUserData('username', 'token');
            expect(sessionService.getName()).toEqual('username');
            expect(sessionService.getToken()).toEqual('token');
            expect(sessionService.isAdmin()).toEqual(false);
        });
    });

}
