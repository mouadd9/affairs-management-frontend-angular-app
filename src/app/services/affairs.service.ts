import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AffairDTO } from '../model/affair-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class AffairsService {

  private baseUrl = environment.backendHost + '/api/affairs';

  constructor(private http: HttpClient) {}

  getAffairs(): Observable<AffairDTO[]> {
    
    return this.http.get<AffairDTO[]>(this.baseUrl + '/');

  }

  updateAffair(affair: AffairDTO): Observable<AffairDTO> {
    return this.http
    .put<AffairDTO>(this.baseUrl + '/' ,affair)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          // Handle CONFLICT error
          console.log('Conflict error: The Affair with the id' + affair.id + 'is not found');
          // You can return a custom error message or handle it as needed
          return throwError(() => new Error('affair not found.'));
        }
        return throwError(() => new Error('An error occurred while updating the affair.'));
      })
    );

  }

  deleteAffair(affairId: number): Observable<void> {
    return this.http.delete<void>(this.baseUrl + '/' + affairId).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          // Handle CONFLICT error
          console.log('Conflict error: The Affair with the id' + affairId + 'is not found');
          // You can return a custom error message or handle it as needed
          return throwError(() => new Error('affair not found.'));
        }
        return throwError(() => new Error('An error occurred while deleting the affair.'));
      })
    );
  }
}
