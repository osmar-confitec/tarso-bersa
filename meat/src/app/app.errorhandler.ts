
import { HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
export class ErrorHandler {
    static handlerErro(error: HttpErrorResponse | any) {
        let errorMessage: string;

        if (error instanceof HttpErrorResponse) {
            const body = error.error;
            errorMessage = ` Error ${body} ${error.status} ao Acessar a Url ${error.url} 
                            -  ${error.statusText}  `
        } else {
            errorMessage = error.toString();
        }
        console.log(errorMessage);
        return Observable.throw(errorMessage);

    }
}