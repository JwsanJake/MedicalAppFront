import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MedicalCartComponent } from './medical-cart/medical-cart.component';



@NgModule({
  imports: [RouterModule.forRoot([
    
    {path: 'main', component: MainComponent},
    {path: ':id', component: MedicalCartComponent},
    {path: '', component: MainComponent},
  ])],

  exports: [RouterModule]
})

export class AppRoutingModule { }
