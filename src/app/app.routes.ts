import { Routes } from '@angular/router';
import { MainPage } from './pages/main.page';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: MainPage },
];
