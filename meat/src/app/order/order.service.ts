import { Injectable} from '@angular/core';
import{ ShoppingCartService } from '../restaurant-detail/shopping-cart/shopping-cart.service'
import { CartItem } from 'app/restaurant-detail/shopping-cart/shopping-card.model';
import { Order,OrderItem } from './order.model'
import { MEAT_API } from '../app.api';
import { Observable } from 'rxjs/Observable';
import {HttpClient } from '@angular/common/http';
import { ErrorHandler } from '../app.errorhandler'
@Injectable()
export class OrderService{

    constructor(private cartService:ShoppingCartService , private http:HttpClient ){


    }

    //private headers:Headers = new Headers({'Content-Type': 'application/json'});

    public clear():void{

        this.cartService.clear();
    }

    public increaseQty(item:CartItem):void
    {
        this.cartService.increaseQuantidade(item);
    }

    public remove(item:CartItem):void{

        this.cartService.removerItem(item);
    }

    public decreaseQty(item:CartItem):void
    {
        this.cartService.decreaseQuantidade(item);
    }
    
    public carItens():CartItem[]
    {
        return this.cartService.items;

    }

    public postOrdemCompra(ordemCompra:Order):Observable<Order>{
        
            return this.http.post<Order>(`${MEAT_API}/orders`,Order);
            
   }
    
    public atualizarOrder(order:Order):void{
        
                            
            }

    public itemsValue():number{

        return this.cartService.totalizar();
    }
}