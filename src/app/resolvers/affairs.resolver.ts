import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';
import { Observable} from 'rxjs';

import { AffairDTO } from '../model/affair-dto.interface';
import { AffairsService } from '../services/affairs.service';

@Injectable({
  providedIn: 'root'
})

export class AffairsResolver implements Resolve<AffairDTO[]> {
  constructor(private affairsService: AffairsService) {}
  resolve(): Observable<AffairDTO[]> {
    return this.affairsService.getAffairs();
  }

}
