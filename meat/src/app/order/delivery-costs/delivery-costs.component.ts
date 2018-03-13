import { Component, OnInit,ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'mt-delivery-costs',
  templateUrl: './delivery-costs.component.html',
  styleUrls: ['./delivery-costs.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DeliveryCostsComponent implements OnInit {


  @Input() delivery:number;
  @Input() itemsValue:number;

  constructor() { }

  ngOnInit() {
  }

  public total():number{

    return this.delivery+ this.itemsValue;

  }

}
