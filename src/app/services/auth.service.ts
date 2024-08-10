import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  roles: any;
  username!: string;
  access_token!: string;

  private apiUrl = 'http://localhost:8085/api/auth/login'; // Auth API endpoint

  constructor(private http: HttpClient) { }
  // on creer une method pour l'authentification
  public login(form: FormData): Observable<any> {

    // first we set headers 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // we can other headers
    });

    // now we send a post request containing the form json the endpoint then the headers

    return this.http.post(this.apiUrl, form, { headers });

  }


  loadProfile(response: any) {
    this.access_token = response['access-token'];

    const decodedToken: any = jwtDecode(this.access_token);

    this.roles = decodedToken.scope; // Assuming roles are stored in a "roles" claim
    this.username = decodedToken.sub; // Assuming username is stored in the "sub" claim

    this.isAuthenticated = true;
  }


}

