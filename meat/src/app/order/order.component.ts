import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InputModel } from '../shared/input/input.model';
import { RadioOption } from '../radio/radio-option.model';
import { OrderService } from './order.service';
import { CartItem } from 'app/restaurant-detail/shopping-cart/shopping-card.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Order, OrderItem } from './order.model'
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms/src/model';


@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [OrderService]
})

export class OrderComponent implements OnInit {


  public orderForm: FormGroup;

  public delivery: number = 8;// valor do frete

  public emailpatern: any = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  public numberpartener: any = /^[0-9]*$/



  public radios: RadioOption[] = [
    new RadioOption("Dinheiro", 1),
    new RadioOption("Cartão", 2),
    new RadioOption("Vale Refeição", 3)
  ]

  constructor(private orderservice: OrderService
    , private router: Router
    , private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.orderForm = this.formBuilder.group({
      nome: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      email: this.formBuilder.control('', [Validators.pattern(this.emailpatern), Validators.required]),
      emailConfirm: this.formBuilder.control('', [Validators.pattern(this.emailpatern), Validators.required]),
      endereco: this.formBuilder.control('', [Validators.required]),
      numero: this.formBuilder.control('', [Validators.pattern(this.numberpartener), Validators.required]),
      complemento: this.formBuilder.control('', [Validators.required]),
      opcaoPagamento: this.formBuilder.control('', [Validators.required])

    }, { validator: OrderComponent.equalsEmail });

  }


  public static equalsEmail(group: AbstractControl): { [key: string]: boolean } {

    const email = group.get('email');
    const emailconfirmation = group.get('emailConfirm');


    if (!email || !emailconfirmation) {
      return undefined;
    }

    if (email.value !== emailconfirmation.value) {
      return { emailsNoMatch: true }
    }
    return undefined;
  }

  public itemsValue(): number {

    return this.orderservice.itemsValue();
  }

  public carItens(): CartItem[] {

    return this.orderservice.carItens();
  }

  public increaseQty(item: CartItem): void {

    this.orderservice.increaseQty(item)

  }
  public decreaseQty(item: CartItem): void {

    this.orderservice.decreaseQty(item);

  }

  public remove(item: CartItem): void {

    this.orderservice.remove(item);

  }
  public salvarOrder(order: Order): void {
    order.Itens = this.carItens().map((item: CartItem) =>
      new OrderItem(item.quantidade, item.menuItem.id)

    );
    // console.log(order);

    this.orderservice.postOrdemCompra(order)
      .subscribe((response: any) => {
        this.orderservice.clear();
        this.router.navigate(['/order-sumary']);

      });
  }
  /*   
    */


}
