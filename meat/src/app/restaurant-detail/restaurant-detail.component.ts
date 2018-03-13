import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurants/restaurants.service';
import {  Restaurant } from '../restaurants/restaurant/restaurant.model';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'mt-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css'],
  providers:[RestaurantService]
})
export class RestaurantDetailComponent implements OnInit {

  public  restaurant:Restaurant;

  constructor(private route:ActivatedRoute ,  private restaurantService:RestaurantService) { }

  ngOnInit() {

    // snapshot ativado apenas a primeira vez que é chamado diferente do ouvinte 
    // observable
    let codigo = this.route.snapshot.params['id'];
    this.restaurantService.restaurantsbyid(codigo)
    .subscribe((res:Restaurant)=>{
       this.restaurant = res;
       console.log(res);
    })

  }

}
