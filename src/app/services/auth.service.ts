import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Observer design pattern library
import { jwtDecode } from "jwt-decode";
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 

  isAuthenticated: boolean = false;
  roles: any;
  username!: any; // we may or may not extract this info
  access_token!: any;

  private apiUrl = environment.backendHost + '/api/auth/login'; // Auth API endpoint

  constructor(private http: HttpClient, private router:Router) { }

  // in a nutshell this whole method will create and send an http request using :
  // - the formData (object) or the body of the request (json)
  // - a url where to send the request
  // - and headers

  // AND MOST IMPORTANTLY WE USE THE HttpClient service which give us the capacity to create http requests and send them

  public login(requBody: FormData): Observable<any> {

    // first we set headers 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // now we send a post request containing the form json the endpoint then the headers
    return this.http.post(this.apiUrl, requBody, { headers });

  }


  loadProfile(response: any) {
    this.isAuthenticated = true;

    // we store the encoded token
    this.access_token = response['access-token'];
    // we decode the token
    const decodedToken: any = jwtDecode(this.access_token);
    // we extract claims
    this.roles = decodedToken.scope; // Assuming roles are stored in a "roles" claim
    this.username = decodedToken.sub; // Assuming username is stored in the "sub" claim
    // we change the session status

    window.localStorage.setItem("jwt-token", this.access_token)
    
    
  }

  public logout(){

    this.isAuthenticated = false;
    this.access_token = undefined;
    this.roles = undefined;
    this.username = undefined;
    window.localStorage.removeItem("jwt-token");
    this.router.navigateByUrl("/login");

  }


  loadJwtTokenFromLocalStorage() {
    let token = window.localStorage.getItem("jwt-token");
    if(token){
      this.loadProfile({"access-token" : token})
      this.redirectUserBasedOnRole();
    }
  }

  redirectUserBasedOnRole() {
    if (this.roles.includes('ADMIN')) {
     
      this.router.navigate(['/admin/dashboard']);
    } else if(this.roles.includes('AGENCY_EMPLOYEE') ) {
      this.router.navigate(['/agencyEmployee']);
    } else {
      this.router.navigate(['/login']);

    }
  }


}





/*  


HttpClient 
has multiple signatures and returns types for each request.
It uses the RxJS observable-based APIs, which means it returns the observable and what we need to subscribe to it.





*/