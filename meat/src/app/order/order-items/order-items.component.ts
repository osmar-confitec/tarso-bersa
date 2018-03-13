import { Component, OnInit , ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { CartItem } from 'app/restaurant-detail/shopping-cart/shopping-card.model';


@Component({
  selector: 'mt-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrderItemsComponent implements OnInit {

@Input()  public itens:CartItem[] ; 

@Output() increaseQtd = new EventEmitter<CartItem>()
@Output() decreaseQtd = new EventEmitter<CartItem>()
@Output() remove = new EventEmitter<CartItem>()

  constructor() { }

  ngOnInit() {
  }

  public emitincreaseQtd(item:CartItem):void{
      this.increaseQtd.emit(item);
  }

  public emitdecreaseQtd(item:CartItem):void{
    this.decreaseQtd.emit(item);
}

    public emitremove(item:CartItem):void{
      this.remove.emit(item);
}

}
