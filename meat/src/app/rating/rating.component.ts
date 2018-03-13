import { Component, OnInit, ViewEncapsulation, Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'mt-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RatingComponent implements OnInit {


  @Output() rated = new EventEmitter<number>();

  public rates: number[] = [1, 2, 3, 4, 5]

  public rate: number = 0;

  public prevRate: number;

  public setRate(r: any) {

    this.rate = r;
    this.prevRate = undefined;
    this.rated.emit(this.rate);
  }

  public setTemporalRate(r: any) {

    if (this.prevRate === undefined) {

      this.prevRate = this.rate;

    }
    this.rate = r;
  }

  public clearTemporalRate() {

    if (this.prevRate !== undefined) {

      this.rate = this.prevRate;
      this.prevRate = undefined;

    }

  }

  constructor() { }

  ngOnInit() {
  }

}
