import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '', component: MainPageComponent },
];
