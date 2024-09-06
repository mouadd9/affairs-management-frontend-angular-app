import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Affair } from '../model/AffairModel';
import { AffairDTO } from '../model/AffairModel/affair-dto.interface';
import { mapAffairDTOToAffair } from '../model/AffairModel/affair-mapper'; 

@Injectable({
  providedIn: 'root'
})
export class AffairsService {

  private baseUrl = environment.backendHost + '/api/affairs';

  constructor(private http: HttpClient) {}

  getAffairs(): Observable<Affair[]> {
    
    return this.http.get<AffairDTO[]>(this.baseUrl + '/').pipe(
      // operations
      // map
      map((dtos: AffairDTO[]) => 
        dtos.map((dto: AffairDTO) => 
          mapAffairDTOToAffair(dto)
        )
      )
    );

  }
}
