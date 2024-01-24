import {Injectable} from "@angular/core";
import {KeycloakService} from "keycloak-angular";

@Injectable({providedIn: "root"})
export class AuthService {
  constructor(private readonly keycloak: KeycloakService) {}

  public isLoggedIn() {
    return this.keycloak.isLoggedIn();
  }

  public login() {
    this.keycloak.login();
  }

  public logout() {
    this.keycloak.logout();
  }
}
