import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { AgenciesService } from '../services/agencies.service';
import { Agency } from '../model/agency.model';

@Injectable({
  providedIn: 'root'
})

export class AgenciesResolver implements Resolve<Agency[]> {
  constructor(private agencyService: AgenciesService) {}
  resolve(): Observable<Agency[]> {
    return this.agencyService.getAllAgencies();
  }

}
