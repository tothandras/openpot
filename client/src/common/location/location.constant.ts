module op.common {

    export class Location {
        latitude: number;
        longitude: number;

        constructor(lat: number = 0, lng: number = 0) {
            this.latitude = lat;
            this.longitude = lng;
        }
    }

    angular.module('op.common')
        .constant('Location', Location);
}
