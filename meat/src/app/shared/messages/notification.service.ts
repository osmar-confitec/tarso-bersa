import {EventEmitter} from '@angular/core';
export class NotificationService{

    notifier = new EventEmitter<string>();

    contructor(){


    }

    notify(message:string){

        this.notifier.emit(message);
    }

}