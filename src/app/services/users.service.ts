import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, switchMap, throwError } from 'rxjs';

// we should import the UserDTO model 
import { UserDTO } from '../model/user.model';
import { UserCounts } from '../model/userCounts.model';

// here we import the environment object 
// This object holds configuration values that can change depending on the environment (e.g., development, production).
import {environment} from "../../environments/environment";
import { AgencyCounts } from '../model/agencyCounts.model';
import { AgencyEmployee } from '../model/Employee-details.interface';




// this service will have methods related to users add user delete user ..........

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  // we will create some subjects to change state
  // users state
  private changeUsersState = new Subject<void>();
  
  changeUsersState$ = this.changeUsersState.asObservable().pipe( switchMap( () => this.getAllUsers() ) ); // here we will switch the observable to emit new users
 // this observable will be subscribed to in order to get users

  changeState(){
    this.changeUsersState.next();
  }

  private closeCreateUserSection = new Subject<void>();


  closeUserForm$ = this.closeCreateUserSection.asObservable();


  closeForm(){
    this.closeCreateUserSection.next();
  }

 


  private baseUrl = environment.backendHost + '/users'; // this is the base url 

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserDTO[]> { // this returns an observable that will stream a list of UserDTOs

    return this.http.get<UserDTO[]>(this.baseUrl + '/');

  }

  getUserCounts(): Observable<UserCounts>{
    let params = new HttpParams()
    .set('countOnly', 'true');
    return this.http.get<UserCounts>(this.baseUrl+'/', {params: params});
  }

  getAgencyCounts(): Observable<AgencyCounts>{

    let params = new HttpParams()
    .set('countOnly', 'true');
    return this.http.get<AgencyCounts>(environment.backendHost + '/agencies/', {params: params})
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>( this.baseUrl + '/'+ userId);
  } 

  createUser(user: UserDTO): Observable<UserDTO> {
    console.log(user);

    return this.http.post<UserDTO>(this.baseUrl+'/', user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.error);
        console.log(error.status);
        console.log(error.message);
        let errorMessage: string;
        switch (error.status) {
          case 409:
           
            errorMessage = error.error || 'User with this username or email already exists.';
            break;
          case 404:
            errorMessage = 'User not found. The user may have been deleted.';
            break;
          case 400:
            errorMessage = 'Invalid input. Please check your data and try again.';
            break;
          default:
            errorMessage = 'Failed to update user. Please try again.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  updateUser(user: UserDTO): Observable<UserDTO> {
    console.log(user);
    return this.http.put<UserDTO>(this.baseUrl+'/'+user.id , user).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.error);
        console.log(error.status);
        console.log(error.message);
        let errorMessage: string;
        switch (error.status) {
          case 409:
           
            errorMessage = error.error || 'User with this username or email already exists.';
            break;
          case 404:
            errorMessage = 'User not found. The user may have been deleted.';
            break;
          case 400:
            errorMessage = 'Invalid input. Please check your data and try again.';
            break;
          default:
            errorMessage = 'Failed to update user. Please try again.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  
  }

  addAdminRole(userId?: number): Observable<void> {
    return this.http.put<void>( this.baseUrl + '/'+ userId +'/add-admin-role', {});
  }

  addEmployeeRole(userId?: number, agencyId?:number) {
    // localhost:8085/api/users/26/agencies/12
    return this.http.put<void>(this.baseUrl + "/" + userId + "/agencies/" + agencyId, {});
  }

  getUsersByAgency(agencyId: number): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.baseUrl + "/agencies/" + agencyId )
  }

  getEmployeeDetailsByUsername(username: string): Observable<AgencyEmployee> {
    return this.http.get<AgencyEmployee>(this.baseUrl + "/details/" + username ) 
  }
 
  checkFirstLoginStatus(username: string): Observable<Boolean> {
    return this.http.get<Boolean>(this.baseUrl + "/first-login-status/" + username)
  } // this will return true if the user is authenticating for the first time and false if he authenticated before

  resetPassword(username: string, newPassword: string) {
    let params = new HttpParams()
    .set('username', username)
    .set('newPassword', newPassword);
    return this.http.post( this.baseUrl + '/reset-password',null, { params: params });
  }
 
}
