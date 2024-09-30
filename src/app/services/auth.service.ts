import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // Observer design pattern library
import { jwtDecode } from "jwt-decode";
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AgencyEmployee } from '../model/Employee-details.interface';
import { UsersService } from './users.service';
import { UserDTO } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  employee: AgencyEmployee = {
    id : 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    agencyId: 0,
    agencyCode: ''
    
  };
  isAuthenticated: boolean = false;
  roles: any;
  username: string = '';
  access_token!: any;
  firstTimeAuth: Boolean = false;


  private apiUrl = environment.backendHost + '/auth/login'; // Auth API endpoint

  constructor(private http: HttpClient, private router: Router, private userService: UsersService) {}

  // here we will add a behavioral subject , when subscribed to it will change the username in the admin template in case the admin edited his name
  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // here we should add a method that will be called after we edit the user
  // we will pass the new state to this method
  updateCurrentUser(user:UserDTO){
    this.currentUserSubject.next(user);
    
  }


  //METHOD 1
  // in a nutshell this whole method will create and send an http request using :
  // - the formData (object) or the body of the request (json)
  // - a url where to send the request
  // - and headers
  // AND MOST IMPORTANTLY WE USE THE HttpClient service which give us the capacity to create http requests and send them
  public login(requBody: FormData): Observable<any> {
    // first we set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // now we send a post request containing the form json the endpoint then the headers
    return this.http.post(this.apiUrl, requBody, { headers });
  }

  //METHOD 2 here we work with the Token decoder ( parser )
  loadProfile(response: any) {
    // we change the session status
    this.isAuthenticated = true;

    // we store the encoded token
    this.access_token = response['access-token'];

    // we decode the token
    const decodedToken: any = jwtDecode(this.access_token);

    // we extract/parse claims
    this.roles = decodedToken.scope; // Assuming roles are stored in a "roles" claim
    this.username = decodedToken.sub; // Assuming username is stored in the "sub" claim
    console.log("this line is right before we store the username's name");
    console.log(this.username);

    window.localStorage.setItem('jwt-token', this.access_token); // here we put the token in our local storage

    this.redirectUserBasedOnRole();
  }

  //METHOD 3
  public logout() {
    this.isAuthenticated = false;

    this.access_token = undefined;
    this.roles = undefined;
    this.username = '';

    window.localStorage.removeItem('jwt-token');
    this.redirectUserBasedOnRole();
  }

  redirectUserBasedOnRole() {
    if (this.isAuthenticated) {
      if (this.roles.includes('ADMIN')) {
        
      this.router.navigate(['/admin/dashboard']);
    } else if (this.roles.includes('AGENCY_EMPLOYEE')) {
      
      this.userService.checkFirstLoginStatus(this.username).subscribe({
        next : status => {
          if(status){
            // this will be checked in the login component ts in order to complete the work 
            this.firstTimeAuth = true;
          } else {
            this.router.navigate(['/agencyEmployee/affairs']);
          }
        },
        error: error => {
          console.error('Error checking first login status:', error);
          this.router.navigate(['/login']);
        }
      })
    } 
    } else {
      this.router.navigate(['/login']);
    }
    
  }

  // this gets called when the the appcomponent launches so we can check if the token exists meaning the user didnt log out
  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem('jwt-token');
    if (token) {
      this.loadProfile({ 'access-token': token });
    }
  }
}





/*  


HttpClient 
has multiple signatures and returns types for each request.
It uses the RxJS observable-based APIs, which means it returns the observable and what we need to subscribe to it.





*/