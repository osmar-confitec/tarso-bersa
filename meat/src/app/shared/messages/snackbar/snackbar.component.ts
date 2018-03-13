import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import{NotificationService} from '../notification.service';
import{ Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap'

@Component({
  selector: 'mt-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('snack-visibility', [
      state('hidden', style({
        opacity: 0,
        bottom: '0px'
      })),
      state('visible', style({
        opacity: 1,
        bottom: '30px'
      })),
      transition('hidden => visible', animate('500ms 0s ease-in')),
      transition('visible => hidden', animate('500ms 0s ease-out'))

    ])
  ]
})
export class SnackbarComponent implements OnInit {

  public snackvisibity:string = 'hidden';

  public Mensagem: any = 'Hello there';

  public tooglesnack(): void {
    if (this.snackvisibity === 'hidden')
      this.snackvisibity = 'visible';
    else this.snackvisibity = 'hidden'

  }

  constructor(private notificacao:NotificationService) { }

  ngOnInit() {
  this.notificacao.notifier.do(Mensagem=>{
      this.Mensagem = Mensagem
      this.snackvisibity = 'visible'
        })
        .switchMap(message=>Observable.timer(3000))
        
        // operador de encadeamento de observables e evita concorrencia no timer
        // por debaixo dos panos ele faz um unsubscribe do ultimo observable para executar o ultimo 
        .subscribe(timer=>this.snackvisibity = 'hidden')
  }

}
