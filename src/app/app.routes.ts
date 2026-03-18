import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DecksComponent } from './decks/decks.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { isNotAuthenticated } from './app.guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
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
  {
    path: 'course/decks',
    component: DecksComponent,
  },
  {
    path: 'deck/flashcards',
    component: FlashcardsComponent,
  },
];
