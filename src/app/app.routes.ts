import { Routes } from '@angular/router';
import {HeroComponent} from '../hero/hero.component';
import {RegisterComponent} from '../register/register.component';
import {LoginComponent} from '../login/login.component';
import {authGuard} from '../guards/auth.guard';
import {HomeComponent} from '../home/home.component';

export const routes: Routes = [
  {path: '', component: HeroComponent, title: 'AddressBookApp'},
  {path: 'register', component: RegisterComponent, title: 'Register'},
  {path: 'login', component: LoginComponent, title: 'Login'},
  {path: 'home', component: HomeComponent, canActivate:[authGuard]},
  {path: '**', redirectTo: 'login'}
];
