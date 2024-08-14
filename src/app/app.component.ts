import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private authService : AuthService){}

  title = 'frontend-angular-demo';

  ngOnInit() {
    this.authService.loadJwtTokenFromLocalStorage();
   
  }
}
