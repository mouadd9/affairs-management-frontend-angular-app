import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// we should import the UserDTO model 
import { UserDTO } from '../model/user.model';
import { UserCounts } from '../model/userCounts.model';

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

  getAllUsers(): Observable<UserDTO[]> { // this returns an observable that will stream a list of UserDTOs

    return this.http.get<UserDTO[]>(this.baseUrl + '/');

  }

  getUserCounts(): Observable<UserCounts>{
    let params = new HttpParams()
    .set('countOnly', 'true');
    return this.http.get<UserCounts>(this.baseUrl+'/', {params: params});
  }

  getAgencyCounts(): Observable<number>{

    let params = new HttpParams()
    .set('countOnly', 'true');
    return this.http.get<number>(environment.backendHost + '/api/agencies/', {params: params})
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>( this.baseUrl + '/'+ userId);
  } 

  createUser(user: UserDTO): Observable<UserDTO> {
    console.log(user);

    return this.http.post<UserDTO>(this.baseUrl+'/', user);
  }

  addAdminRole(userId?: number): Observable<void> {
    return this.http.put<void>( this.baseUrl + '/'+ userId, {});
  }
 

}
