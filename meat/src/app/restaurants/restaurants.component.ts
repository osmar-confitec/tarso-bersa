import { Component, OnInit } from '@angular/core';
import {Restaurant} from './restaurant/restaurant.model';
import { RestaurantService } from './restaurants.service';
@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css'],
  providers:[ RestaurantService ]
})
export class RestaurantsComponent implements OnInit {

  public restaurants:Restaurant[] = [];

  constructor( private restService:  RestaurantService) { }

  ngOnInit() {

    this.restService.restaurants()
        .subscribe(rest=>this.restaurants = rest);
  }

}
