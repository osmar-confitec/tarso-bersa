import { Component, OnInit, ViewEncapsulation, Input, ContentChild,AfterContentInit } from '@angular/core';
import{ InputModel }from'./input.model'
import { ViewChild } from '@angular/core/src/metadata/di';
import {NgModel, FormControlName} from '@angular/forms'
@Component({
  selector: 'mt-input-container',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InputComponent implements OnInit , AfterContentInit {
  @Input() public Input:InputModel ;
  @ContentChild(NgModel) modelo:NgModel;
  @ContentChild(FormControlName) control:FormControlName;

  public input :any;

  @Input() Label:string;
  @Input() ErrorMessage:string;
  
  ngAfterContentInit(): void {

      this.input = this.modelo || this.control;
      if (this.input === undefined)
      {
        throw new Error(" Atenção! esse componente precisa ser utilizado com uma ng model ou form control name");
      }
  }



  constructor() { }

  ngOnInit() {
  }

}
