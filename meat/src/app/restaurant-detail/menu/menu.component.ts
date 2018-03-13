import { Component, OnInit , ViewEncapsulation  } from '@angular/core';


import { MenuItem } from '../menu-item/menu-item.model';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../restaurants/restaurants.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'mt-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {


  public addMenuItem(item:MenuItem):void{

      console.log(item);

  }
  public menu:Observable<MenuItem[]>;

  constructor(private router:ActivatedRoute ,private restaurantservico:RestaurantService) { }

  ngOnInit() {
    this.menu = this.restaurantservico.menuOfRestaurant(this.router.parent.snapshot.params['id']);
  }

}
