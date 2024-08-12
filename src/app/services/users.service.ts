import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// we should import the UserDTO model 
import { UserDTO } from '../model/user.model';

// here we import the environment object 
// This object holds configuration values that can change depending on the environment (e.g., development, production).
import {environment} from "../../environments/environment";


// this service will have methods related to users add user delete user ..........

@Injectable({
  providedIn: 'root'
})

export class UsersService { 

  private baseUrl = environment.backendHost + '/api/users'; // this is the base url 

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<Array<UserDTO>> { // this returns an observable that will stream a list of UserDTOs

    return this.http.get<Array<UserDTO>>(this.baseUrl + '/');

  }

}
