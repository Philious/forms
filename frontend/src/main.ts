import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import { AppComponent } from './app/app.component';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

bootstrapApplication(AppComponent, appConfig).catch((err: Error) => console.error(err.message));
