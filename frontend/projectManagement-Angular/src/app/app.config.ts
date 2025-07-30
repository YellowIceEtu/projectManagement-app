import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthInterceptor])),
    importProvidersFrom(BrowserAnimationsModule),
       provideAnimations(),   // ✅ Pour @angular/animations
 importProvidersFrom(FullCalendarModule),
 provideZoneChangeDetection({ eventCoalescing: true }),

    // provideHttpClient(), 
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
