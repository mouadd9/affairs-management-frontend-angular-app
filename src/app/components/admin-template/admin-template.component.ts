import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserDTO } from '../../model/user.model';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css',
})
export class AdminTemplateComponent implements OnInit {
  sub: Subscription = new Subscription;
  constructor(public authService: AuthService) {} // we will inject the auth service so we can log out , and the routing service so we can rout to the login page

  ngOnInit() {
    this.sub = this.authService.currentUser$.subscribe({
      next: user => {this.authService.username = user!.username}
    })
  }
  logOut() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
   this.sub.unsubscribe();
    
  }
}
