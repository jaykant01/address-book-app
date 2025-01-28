import { Routes } from '@angular/router';
import {HeroComponent} from '../hero/hero.component';
import {RegisterComponent} from '../register/register.component';

export const routes: Routes = [
  {path: '', component: HeroComponent, title: 'AddressBookApp'},
  {path: 'register', component: RegisterComponent, title: 'Register'}
];
