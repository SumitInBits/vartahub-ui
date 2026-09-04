import { Routes } from '@angular/router';
import { SignupPage } from './pages/signup-page/signup-page';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'signup', component: SignupPage, canActivate: [authGuard]},
];
