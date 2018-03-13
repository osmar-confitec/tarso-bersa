import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import{trigger,state,style,transition,animate,keyframes} from '@angular/core'

@Component({
  selector: 'mt-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('row', [
      state('ready', style({opacity: 1})),
      transition('void=> ready', animate('300ms 0s ease-in', keyframes([
        style({opacity: 0, transform: 'translateX(-30px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(-10px)', offset: 0.8}),
        style({opacity: 1, transform: 'translateX(0px)', offset: 1})
      ]))),
      transition('ready=> void', animate('500ms 0s ease-in', keyframes([
        style({opacity: 1, transform: 'translateX(0px)', offset: 0}),
        style({opacity: 0.8, transform: 'translateX(-10px)', offset: 0.2}),
        style({opacity: 1, transform: 'translateX(30px)', offset: 1})
      ])))
    ])
]
})
export class ShoppingCartComponent implements OnInit {

  constructor( private shoppingcarservice:ShoppingCartService ) { }
  rowState = 'ready';
  public items(): any[] {

    return this.shoppingcarservice.items;

  }

  public total():number{

    return this.shoppingcarservice.totalizar();

  }


  public addItem(item:any):void{
    this.shoppingcarservice.addItem(item);

  }

  public removeItem(item:any):void{
     this.shoppingcarservice.removerItem(item);
  }

  public clear(){

    this.shoppingcarservice.clear();

  }

  ngOnInit() {
  }

}
