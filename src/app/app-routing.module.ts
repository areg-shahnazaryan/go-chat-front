import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AuthGuard} from './services/auth.guard';
import {LoginComponent} from './components/login/login.component';

const routes: Routes = [
  {
    path: '',  component: HomeComponent, canActivate: [AuthGuard]
  },
  {
    path: 'login', pathMatch: 'full', component: LoginComponent
  },
  {
    path: '**',  redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
