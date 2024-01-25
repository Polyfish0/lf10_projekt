import {Component, Injectable, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KeycloakService} from "keycloak-angular";
import {initKeycloak} from "../app.config";
import {AuthService} from "../app.auth.service";

@Component({
  selector: 'app-employee-service',
  standalone: true,
  templateUrl: './employee-service.component.html',
  styleUrl: './employee-service.component.css'
})
export class EmployeeServiceComponent implements OnInit {
  private isLoggedIn = false;

  constructor(private readonly authService: AuthService) {}

  public ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();

    if(!this.isLoggedIn)
      this.authService.login();
  }
}
