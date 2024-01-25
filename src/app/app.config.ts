import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {provideHttpClient} from "@angular/common/http";
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(KeycloakAngularModule),
    {
        provide: APP_INITIALIZER,
        useFactory: initKeycloak,
        multi: true,
        deps: [KeycloakService]
    },
    provideHttpClient(),
    provideAnimations()
]
};

export function initKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init({
    config: {
      url: "https://keycloak.szut.dev/auth/",
      realm: "szut",
      clientId: "employee-management-service-frontend"
    },
    initOptions: {
      onLoad: "check-sso",
      checkLoginIframe: false
    },
    enableBearerInterceptor: true
  });
}
