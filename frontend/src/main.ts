import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(environment.serviceWorkerURL);
}

bootstrapApplication(AppComponent, appConfig).catch((err: Error) => console.error(err.message));
