import {NgModule} from "@angular/core";
import {InputComponent} from './input/input.component';
import {RadioComponent} from '../radio/radio.component';
import {RatingComponent} from '../rating/rating.component';
import { FormsModule , ReactiveFormsModule }from '@angular/forms'
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './messages/snackbar/snackbar.component'
import { NotificationService} from '../shared/messages/notification.service';


@NgModule({

    declarations:[InputComponent, RadioComponent,RatingComponent, SnackbarComponent],
    imports:[CommonModule,FormsModule,ReactiveFormsModule],
    exports:[InputComponent, RadioComponent,RatingComponent,
    CommonModule,FormsModule,ReactiveFormsModule,SnackbarComponent],
    providers:[NotificationService]

})
export class SharedModule{


}