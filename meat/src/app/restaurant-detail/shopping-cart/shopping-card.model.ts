import { MenuItem } from "app/restaurant-detail/menu-item/menu-item.model";

export  class CartItem {

    constructor(public menuItem:MenuItem, public quantidade: number = 1 ){}

     public valor():number{

        return this.menuItem.price * this.quantidade;
     }       

}