import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable} from 'rxjs';

import { Affair } from '../model/AffairModel';
import { AffairsService } from '../services/affairs.service';

@Injectable({
  providedIn: 'root'
})

export class AffairsResolver implements Resolve<Affair[]> {
  constructor(private affairsService: AffairsService) {}
  resolve(): Observable<Affair[]> {
    return this.affairsService.getAffairs();
  }

}
