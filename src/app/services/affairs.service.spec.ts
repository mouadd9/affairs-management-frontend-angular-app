import { TestBed } from '@angular/core/testing';

import { AffairsService } from './affairs.service';

describe('AffairsService', () => {
  let service: AffairsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AffairsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
