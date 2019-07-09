import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {ChatboxComponent} from "./chatbox/chatbox.component";
import {AuthGuard} from "./auth.guard";


const appRoutes:Routes = [
  {path:'',component:LoginComponent},
  {path:'chat',component:ChatboxComponent,canActivate:[AuthGuard]}
];
@NgModule({
  imports:[RouterModule.forRoot(appRoutes)],
  exports:[RouterModule]
})

export class AppRoutingModule {

}
