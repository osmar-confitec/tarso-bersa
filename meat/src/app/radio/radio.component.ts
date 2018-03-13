import { Component, OnInit  , ViewEncapsulation , Input, forwardRef } from '@angular/core';
import { RadioOption } from './radio-option.model';
import { NG_VALUE_ACCESSOR , ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'mt-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[{
    provide:NG_VALUE_ACCESSOR,
    useExisting:forwardRef(()=>RadioComponent),
    multi:true
  }]
})
export class RadioComponent implements OnInit , ControlValueAccessor {



  @Input() public options:RadioOption[] = [];
  
    public valor:any;
  
    constructor() { }
  
    public setValue(valor){
  
      this.valor = valor;
      this.onChange(this.valor);
  
    }

    public onChange:any;

  writeValue(obj: any): void {
    this.valor = obj;
   // throw new Error("Method not implemented.");
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
   // throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  }

 

  ngOnInit() {
  }

}
