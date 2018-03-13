import { Restaurant } from './restaurant/restaurant.model';

import { Injectable } from '@angular/core';
import { MEAT_API } from '../app.api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
//import { ErrorHandler } from '../app.errorhandler'
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable() 
export class RestaurantService {

    constructor(private http:HttpClient) {

    }

    restaurantsSearch(search?:string):Observable<Restaurant[]>{

        let params:HttpParams= undefined;
        if(search){
            params = new HttpParams().set('q',search);
        }

        return this.http.get<Restaurant[]>(`${MEAT_API}/menu/?restaurants`,{params:params});

    }

    public restaurantsbyid(id:string):Observable<Restaurant>{

            return this.http.get<Restaurant>(`${MEAT_API}/restaurants/?id=${id}`);
          //  .map(response=>  response.json().length > 0 ?  response.json()[0] : new Observable<Restaurant>()   )
           // .catch(ErrorHandler.handlerErro);

    }

    public menuOfRestaurant(id:string):Observable<any>{

        return this.http.get<any>(`${MEAT_API}/menu/?restaurantId=${id}`);
       // .map(response=>response.json())
       // .catch(ErrorHandler.handlerErro);
    }

    public reviewsOfRestaurant(id:string):Observable<any>{

        return this.http.get<any>(`${MEAT_API}/reviews/?restaurantId=${id}`);

        //.map(response=>response.json())
        //.catch(ErrorHandler.handlerErro);
    }

    

    public restaurants():Observable<Restaurant[]> {


       return this.http.get<Restaurant[]>(` ${MEAT_API}/restaurants`);
               //  .map(response=>response.json())
                // .catch(ErrorHandler.handlerErro);
      /*  return  [

            {
                id: "bread-bakery",
                name: "Bread & Bakery",
                category: "Bakery",
                deliveryEstimate: "25m",
                rating: 4.9,
                imagePath: "assets/img/restaurants/breadbakery.png",
                about: "A Bread & Brakery tem 40 anos de mercado. Fazemos os melhores doces e pães. Compre e confira.",
                hours: "Funciona de segunda à sexta, de 8h às 23h"
            },
            {
                id: "burger-house",
                name: "Burger House",
                category: "Hamburgers",
                deliveryEstimate: "100m",
                rating: 3.5,
                imagePath: "assets/img/restaurants/burgerhouse.png",
                about: "40 anos se especializando em trash food.",
                hours: "Funciona todos os dias, de 10h às 22h"
            }

        ];  */
    }
}