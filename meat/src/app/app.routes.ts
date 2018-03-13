import { Routes }from '@angular/router';
import { HomeComponent }from './home/home.component';
//import { AboutComponent } from './about/about.component'
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component'
import { RestaurantsComponent } from 'app/restaurants/restaurants.component';
import { MenuComponent } from './restaurant-detail/menu/menu.component';
import { ReviewsComponent } from './restaurant-detail/reviews/reviews.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import {  OrderComponent} from './order/order.component';
import {OrderSumaryComponent} from './order-sumary/order-sumary.component';
import { LoginComponent } from './security/login/login.component'

export const ROUTES:Routes = [
    {path:'' , component:HomeComponent},
    {path:'login' , component:LoginComponent},
    {path:'about' , loadChildren:'./about/about.module#AboutModule'},
    {path:'order-sumary' , component:OrderSumaryComponent},
    {path:'restaurants' , component:RestaurantsComponent},
    {path:'order' , loadChildren:'./order/order.module#OrderModule'},
    {path:'restaurants/:id' 
    ,component:RestaurantDetailComponent
    ,children:[
        {path:'' ,redirectTo:'menu' , pathMatch:'full'},
        {path:'menu' , component:MenuComponent},
        {path:'reviews' , component:ReviewsComponent}
    ]},
    {path: '**' , component : NotFoundComponent}


]