import { Component, OnInit ,ViewEncapsulation, Input, EventEmitter , Output  } from '@angular/core';
import { MenuItem } from './menu-item.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'mt-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('menuitemApperead', [
      state('ready', style({opacity: 1})),
      transition('void=> ready', [
          style({opacity: 0, transform: 'translatey(-20px)'}),
          animate('300ms 0s ease-in')
      ])
    ])
]
})
export class MenuItemComponent implements OnInit {


  @Input() public menuItem: MenuItem
  @Output() add  = new EventEmitter();
  menuItemState = 'ready';

  public emitAddEvent(): void {

    this.add.emit(this.menuItem);
  }

  constructor() { }

  ngOnInit() {
  }

}
