import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {RestaurantService} from '../../restaurants/restaurants.service';
import { Observable } from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'mt-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[RestaurantService]
})
export class ReviewsComponent implements OnInit {

  constructor(private restaurantService: RestaurantService ,private route:ActivatedRoute) { }

  public reviews:Observable<any>;

    ngOnInit() {
    let codigo = this.route.snapshot.parent.params['id'];
    console.log(codigo);
      this.reviews = this.restaurantService.reviewsOfRestaurant(codigo);
  }

}
