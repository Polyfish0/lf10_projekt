import {Injectable} from "@angular/core";
import {KeycloakService} from "keycloak-angular";

@Injectable({providedIn: "root"})
export class AuthService {
  constructor(private readonly keycloak: KeycloakService) {}

  public isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  public login() {
    return this.keycloak.login();
  }

  public logout() {
    return this.keycloak.logout();
  }

  public async getToken(): Promise<string> {
    if(this.keycloak.isTokenExpired())
      await this.keycloak.updateToken()
    return this.keycloak.getToken()
  }
}
