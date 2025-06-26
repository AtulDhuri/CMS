import { ApplicationConfig, provideZoneChangeDetection, NgZone } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core Angular providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router and navigation
    provideRouter(routes),
    
    // HTTP and API
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // Browser-specific providers
    provideAnimations(),
    provideClientHydration(),
    
    // Explicit NgZone provider for Angular Elements
    {
      provide: NgZone,
      useFactory: () => new NgZone({ enableLongStackTrace: false })
    }
  ]
};
