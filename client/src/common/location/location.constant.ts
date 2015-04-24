module op.common {

    export class Location {
        lat: number;
        lng: number;

        constructor(lat: number = 0, lng: number = 0) {
            this.lat = lat;
            this.lng = lng;
        }
    }

    angular.module('op.common')
        .constant('Location', Location);
}
