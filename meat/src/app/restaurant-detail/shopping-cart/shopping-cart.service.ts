import { CartItem } from "app/restaurant-detail/shopping-cart/shopping-card.model";
import { MenuItem } from '../menu-item/menu-item.model';
import { iterateListLike } from "@angular/core/src/change_detection/change_detection_util";
import { Injectable } from "@angular/core";
import { NotificationService } from "app/shared/messages/notification.service";

@Injectable()
export class ShoppingCartService {

    public items: CartItem[] = [];

    public clear(): void {

        this.items = [];

    }

    constructor(private notificar:NotificationService){


    }

    public addItem(item: MenuItem): void {

        let foundItem = this.items.find((mItem) => mItem.menuItem.id === item.id);
        if (foundItem) {
            this.increaseQuantidade(foundItem);

        } else {
            this.items.push(new CartItem(item));
        }
        this.notificar.notify( ` Atenção! dados atualizados com sucesso!!!! ${item.name} ` );
    }




    public decreaseQuantidade(item: CartItem): void {

        item.quantidade = item.quantidade - 1;
        if (item.quantidade <= 0 ){
            this.removerItem(item);
        }
    }
    public increaseQuantidade(item: CartItem): void {

        
        item.quantidade = item.quantidade + 1;
    }

    public removerItem(item: CartItem): void {

        this.items.splice(this.items.indexOf(item), 1);
        this.notificar.notify( ` Atenção! você removeu o item  ${item.menuItem.name} ` );

    }

    public totalizar(): number {

       

        let valor:number  = 0 ;

        this.items.map(function(elem:CartItem ){
            valor+= elem.valor();
        });

        
        
        return valor;
    }

}