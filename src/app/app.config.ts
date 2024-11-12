import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaSettings, ReCaptchaV3Service } from 'ng-recaptcha';
import { DateDisplayPipe } from './pipes/date-display.pipe';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DateTurnPipe } from './pipes/date-turn.pipe';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: 'AIzaSyBEOqJ1iBrscIXurQZiDGSgvVlfwJFro58',
        authDomain: 'appspps-5d63c.firebaseapp.com',
        projectId: 'appspps-5d63c',
        storageBucket: 'appspps-5d63c.appspot.com',
        messagingSenderId: '884825518649',
        appId: '1:884825518649:web:27724d93fa03ea5dd313e8',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    importProvidersFrom(ReCaptchaV3Service),
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LeZK3QqAAAAALL20lIsEsCQLu56ZdTx11t8fWJ0',
      } as RecaptchaSettings,
    },
    provideAnimations(),
    DateDisplayPipe,
    DateTurnPipe,
  ],
};
