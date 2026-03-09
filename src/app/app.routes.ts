import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { isNotAuthenticated } from './app.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full' ,
  },
  {
    path: 'login',
    component: LoginComponent,
    canMatch: [isNotAuthenticated],
  },
  {
    path: 'home',
    component: HomeComponent,
  },
];
