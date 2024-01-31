import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from "@angular/router";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {EmployeeServiceComponent} from "./employee-service/employee-service.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AuthService} from "./app.auth.service";
import {MatSidenavContent} from "@angular/material/sidenav";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeServiceComponent,
    KeycloakAngularModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatSidenavContent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Toothless Dragon Dancing';
  loggedIn = this.authService.isLoggedIn();

  constructor(private readonly authService: AuthService) {}

  handleLogInOutButton() {
    if(this.loggedIn)
      this.authService.logout();
    else
      this.authService.login();
  }
}
