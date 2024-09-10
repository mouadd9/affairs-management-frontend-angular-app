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

export class AffairCountResolver implements Resolve<number> {
  constructor(private affairsService: AffairsService) {}
  resolve(): Observable<number> {
    return this.affairsService.getAffairCounts();
  }

}
