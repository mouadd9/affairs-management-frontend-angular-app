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
    const lastLog = localStorage.getItem('lastAuthGuardLog');
    if (lastLog) {
      console.log('Last AuthGuard Log:', lastLog);
      localStorage.removeItem('lastAuthGuardLog');
    }
  }
}
