import { Routes } from '@angular/router';
import { MainPage } from './pages/main.page';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: MainPage },
];
