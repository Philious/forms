import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet />`,
})
export class AppComponent {
  apiService = inject(ApiService);
  constructor() {
    this.apiService.get.user({ complete: this.apiService.get.all });
  }
}
