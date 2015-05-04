module op.common {
    'use strict';

    export class GravatarService {

        /* @ngInject */
        constructor(public md5: any) {
            return {
                gravatar(email: string): string {
                    return 'http://www.gravatar.com/avatar/' + md5.createHash(email || '') + '?d=mm&s=200';
                }
            }
        }
    }

    angular.module('op.common')
        .service('GravatarService', GravatarService);
}
