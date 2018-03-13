import { Component, OnInit, Input } from '@angular/core';
import { Restaurant} from './restaurant.model';
// tslint:disable-next-line:no-unused-variable
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'mt-restaurant',
  templateUrl: './restaurant.component.html',
  animations: [
      trigger('restaurantApperead', [
        state('ready', style({opacity: 1})),
        transition('void=> ready', [
            style({opacity: 0, transform: 'translate(-30px,-10px)'}),
            animate('300ms 0s ease-in-out')
        ])
      ])
  ],
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  @Input() restaurant: Restaurant;

  restaurantState = 'ready';

  constructor() { }

  ngOnInit() {
  }

}
