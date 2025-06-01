import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main.page';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: MainPageComponent },
];
