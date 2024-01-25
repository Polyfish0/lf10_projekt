import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../app.auth.service";

@Component({
  selector: 'app-qualifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qualifications.component.html',
  styleUrl: './qualifications.component.css'
})
export class QualificationsComponent implements OnInit {
  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    if(!this.authService.isLoggedIn())
      this.authService.login();
  }
}
