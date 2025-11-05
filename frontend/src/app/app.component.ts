import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export class AppComponent {
  constructor(apiService: ApiService) {
    apiService.get.user({ complete: apiService.get.all });
  }
}
