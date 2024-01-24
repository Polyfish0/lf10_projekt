import {APP_INITIALIZER, Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import {RouterOutlet} from "@angular/router";
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {EmployeeServiceComponent} from "./employee-service/employee-service.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeServiceComponent,
    KeycloakAngularModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'lf10StarterNew';
}
