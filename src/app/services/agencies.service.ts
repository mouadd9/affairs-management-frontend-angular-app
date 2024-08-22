import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, Subject, switchMap, throwError } from 'rxjs';
import { Agency } from '../model/agency.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgenciesService {


   // we will create some subjects to change state
  // users state
  private changeAgenciesState = new Subject<void>();
  
  changeAgenciesState$ = this.changeAgenciesState.asObservable().pipe( switchMap( () => this.getAllAgencies() ) ); // here we will switch the observable to emit new users
 // this observable will be subscribed to in order to get users

  changeState(){
    this.changeAgenciesState.next();
  }


  private closeCreateAgencySection = new Subject<void>();

  closeAgencyForm$ = this.closeCreateAgencySection.asObservable();

  closeForm(){
    this.closeCreateAgencySection.next();

  }

  private baseUrl = environment.backendHost + '/api/agencies'; // this is the base url 
  constructor(private http: HttpClient) { }

  getAllAgencies(): Observable<Agency[]>  {

    return this.http.get<Agency[]>(this.baseUrl + "/");

  }

  createAgency(newAgency: Agency): Observable<Agency> {
    return this.http.post<Agency>(this.baseUrl + "/", newAgency).pipe(
      catchError( (error : HttpErrorResponse) => {
        if(error.status === HttpStatusCode.Conflict){
          console.log('Conflict error: Code taken');
          // You can return a custom error message or handle it as needed
          return throwError(() => new Error('The agency code is taken.'));

        }
        return throwError(() => new Error('An error occurred while creating the agency.'));
        
      }
      )
    );
  } 

  deleteAgency(agencyId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + "/" + agencyId).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          // Handle CONFLICT error
          console.log('Conflict error: The agency cannot be deleted');
          // You can return a custom error message or handle it as needed
          return throwError(() => new Error('The agency has users.'));
        }
        // Handle other errors
        return throwError(() => new Error('An error occurred while deleting the agency.'));
      })

      
    );
  }
}
