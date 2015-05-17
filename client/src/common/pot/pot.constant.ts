module op.common {
    export interface IPot {
        id: string;
        cook: string;
        consumer: string;
        name: string;
        description: string;
        address: string;
        user?: IUser;
        image?: File;
        rating: number;

        setPot: (pot: IPot) => void;
    }

    export class Pot implements IPot {
        id: string;
        cook: string;
        consumer: string;
        name: string;
        description: string;
        address: string;
        amount: number;
        image: File;
        rating: number;

        constructor(obj?: any) {
            this.setPot(obj)
        }

        setPot(obj?: any): void {
            this.id = obj && obj.id;
            this.cook = obj && obj.cook;
            this.consumer = obj && obj.consumer;
            this.name = obj && obj.name;
            this.description = obj && obj.description;
            this.address = obj && obj.address;
            this.amount = obj && obj.amount;
            this.image = obj && obj.image;
            this.rating = obj && obj.rating || 1;
        }
    }

    angular.module('op.common')
        .constant('Pot', Pot);
}
