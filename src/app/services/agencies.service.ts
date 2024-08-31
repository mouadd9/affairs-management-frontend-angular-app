import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import {
  catchError,
  Observable,
  Subject,
  switchMap,
  throwError,
  throwIfEmpty,
} from 'rxjs';
import { Agency } from '../model/agency.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgenciesService {
  // we will create some subjects to change state
  // users state
  private changeAgenciesState = new Subject<void>();

  changeAgenciesState$ = this.changeAgenciesState
    .asObservable()
    .pipe(switchMap(() => this.getAllAgencies())); // here we will switch the observable to emit new users
  // this observable will be subscribed to in order to get users

  changeState() {
    this.changeAgenciesState.next();
  }

  private closeCreateAgencySection = new Subject<void>();

  closeAgencyForm$ = this.closeCreateAgencySection.asObservable();

  closeForm() {
    this.closeCreateAgencySection.next();
  }

  private baseUrl = environment.backendHost + '/api/agencies'; // this is the base url
  constructor(private http: HttpClient) {}

  getAllAgencies(): Observable<Agency[]> {
    return this.http.get<Agency[]>(this.baseUrl + '/');
  }

  createAgency(newAgency: Agency): Observable<Agency> {
    return this.http.post<Agency>(this.baseUrl + '/', newAgency).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

    // this method will send a put request to the backend and it will return an observable
    updateAgency(updatedAgency: Agency): Observable<Agency> {
      return this.http
        .put<Agency>(this.baseUrl + '/' + updatedAgency.id, updatedAgency)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
          })
        );
    }

  deleteAgency(agencyId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + agencyId).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          // Handle CONFLICT error
          console.log('Conflict error: The agency cannot be deleted');
          // You can return a custom error message or handle it as needed
          return throwError(() => new Error('The agency has users.'));
        }
        // Handle other errors
        return throwError(
          () => new Error('An error occurred while deleting the agency.')
        );
      })
    );
  }



  // this method will handle errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage =
            'Bad Request: The request was invalid or cannot be served.';
          break;
        case 404:
          errorMessage = 'The agency you are trying to update was not found.';
          break;

        case 409:
          errorMessage = 'Conflict: The agency code is already taken.';
          break;
        case 403:
          errorMessage =
            'Access Denied: You do not have permission to perform this action.';
          break;

        default:
          errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
      }
    }

    console.error('An error occurred:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
